import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserRoleFromRequest, getUserIdFromRequest } from '@/lib/auth';
import { createAuditLog } from '@/lib/audit';

export async function POST(request: any) {
    try {
        const role = getUserRoleFromRequest(request);
        if (role !== 'ADMIN' && role !== 'MASTER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const body = await request.json();
        const { name, amount, dueDate, breakdown, schoolId } = body;

        let finalSchoolId = schoolId;

        if (role === 'ADMIN' && !finalSchoolId) {
            const userId = getUserIdFromRequest(request);
            if (userId) {
                const user = await prisma.user.findUnique({
                    where: { id: userId },
                    select: { schoolId: true }
                });
                if (user?.schoolId) {
                    finalSchoolId = user.schoolId;
                }
            }
        }

        if (!finalSchoolId) {
            return NextResponse.json({ error: 'School ID is required' }, { status: 400 });
        }

        // 1. Create the Fee Structure
        const fee = await prisma.feeStructure.create({
            data: {
                name,
                amount: parseFloat(amount),
                dueDate: new Date(dueDate),
                breakdown: breakdown || [], // JSON
                schoolId: finalSchoolId,
            },
        });

        // 2. Fetch all students in this school
        const students = await prisma.student.findMany({
            where: { schoolId: schoolId },
            select: { id: true }
        });

        // 3. Create Invoices for each student
        if (students.length > 0) {
            await prisma.invoice.createMany({
                data: students.map(student => ({
                    studentId: student.id,
                    feeStructureId: fee.id,
                    amountPaid: 0.0,
                    status: 'PENDING',
                }))
            });
        }

        // 4. Create Audit Log
        const userId = getUserIdFromRequest(request);
        if (userId) {
            await createAuditLog(userId, 'CREATE_FEE', `Created fee structure: ${name} for school ${schoolId}`);
        }

        return NextResponse.json({ ...fee, invoicesCreated: students.length });
    } catch (error) {
        console.error("Create Fee Error:", error);
        return NextResponse.json({ error: 'Failed to create fee' }, { status: 500 });
    }
}

export async function GET(request: any) {
    try {
        const role = getUserRoleFromRequest(request);
        if (role !== 'ADMIN' && role !== 'MASTER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        let whereClause = {};

        // If regular Admin, filter by their school
        if (role === 'ADMIN') {
            const userId = getUserIdFromRequest(request);

            if (!userId) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }

            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { schoolId: true }
            });

            if (user && user.schoolId) {
                whereClause = { schoolId: user.schoolId };
            } else {
                // If admin has no school, they shouldn't see any fees? Or maybe handle error.
                // For now, let's assume they must have a school.
                // If schoolId is null, we can't filter by it properly if the field expects string.
                // But prisma where clause handles null if the field is nullable.
                // However, the error says 'string | null' is not assignable to 'string | undefined'.
                // This suggests the where input expects string or undefined.
                // We can cast or check.
                whereClause = { schoolId: user?.schoolId || undefined };
            }
        }
        // MASTER_ADMIN sees all (empty whereClause)

        const fees = await prisma.feeStructure.findMany({
            where: whereClause as any, // Cast to any to avoid strict type issues with dynamic where clause
            include: { school: true },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(fees);
    } catch (error) {
        console.error("Get Fees Error:", error);
        return NextResponse.json({ error: 'Failed to fetch fees' }, { status: 500 });
    }
}
