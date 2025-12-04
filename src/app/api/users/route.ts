import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, getUserRoleFromRequest, getUserIdFromRequest } from '@/lib/auth';
import { createAuditLog } from '@/lib/audit';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const role = searchParams.get('role');

        const whereClause = role ? { role: role as any } : {};

        const users = await prisma.user.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            include: {
                department: true,
                student: true,
                school: true,
            }
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error('Get users error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const role = getUserRoleFromRequest(request as any);
        if (!role) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { email, password, name, role: newUserRole, departmentId, phoneNumber, schoolId } = body;

        if (!email || !password || !name || !newUserRole) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // RBAC Checks
        if (role === 'STAFF' && newUserRole !== 'STUDENT') {
            return NextResponse.json({ error: 'Staff can only create Student accounts' }, { status: 403 });
        }
        if (role === 'ADMIN' && newUserRole === 'MASTER_ADMIN') {
            return NextResponse.json({ error: 'Admins cannot create Master Admins' }, { status: 403 });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await hashPassword(password);



        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: newUserRole,
                departmentId: departmentId || null,
                schoolId: schoolId || null,
                phoneNumber: phoneNumber || null,
            },
        });

        // Log action
        const creatorId = getUserIdFromRequest(request as any);
        if (creatorId) {
            await createAuditLog(creatorId, 'CREATE_USER', `Created user ${user.email} with role ${user.role}`);
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Create user error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
