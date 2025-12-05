import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, getUserRoleFromRequest, getUserIdFromRequest } from '@/lib/auth';
import { createAuditLog } from '@/lib/audit';
import { backfillInvoicesForStudent } from '@/lib/fees';

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

        // If creating a student, create the specific student record and backfill invoices
        if (newUserRole === 'STUDENT' && schoolId) {
            try {
                // Generate a temporary ID if not provided (Admin can update later)
                const studentIdNumber = `ID-${Date.now()}`;

                const student = await prisma.student.create({
                    data: {
                        userId: user.id,
                        schoolId: schoolId,
                        studentIdNumber: studentIdNumber,
                        grade: "Level 100", // Default
                        campus: "Main Campus", // Default
                        wallet: {
                            create: { balance: 0.0 }
                        }
                    }
                });

                await backfillInvoicesForStudent(student.id, schoolId);
            } catch (studentError) {
                console.error("Failed to auto-create student profile during user creation:", studentError);
                // We don't rollback the user, but we log the error. Admin can fix via Edit.
            }
        }

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
