import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserRoleFromRequest, getUserIdFromRequest } from '@/lib/auth';

export async function POST(request: any) {
    try {
        const role = getUserRoleFromRequest(request);
        if (role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

        const body = await request.json();
        const { name, amount, dueDate, breakdown, schoolId } = body;

        if (!schoolId) {
            return NextResponse.json({ error: 'School ID is required' }, { status: 400 });
        }

        // 1. Create the Fee Structure
        const fee = await prisma.feeStructure.create({
            data: {
                name,
                amount: parseFloat(amount),
                dueDate: new Date(dueDate),
                breakdown: breakdown || [], // JSON
                schoolId: schoolId,
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

        return NextResponse.json({ ...fee, invoicesCreated: students.length });
    } catch (error) {
        console.error("Create Fee Error:", error);
        return NextResponse.json({ error: 'Failed to create fee' }, { status: 500 });
    }
}

export async function GET(request: any) {
    try {
        const role = getUserRoleFromRequest(request);
        if (role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

        const userId = getUserIdFromRequest(request);
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { schoolId: true }
        });

        const whereClause = user?.schoolId ? { schoolId: user.schoolId } : {};

        const fees = await prisma.feeStructure.findMany({
            where: whereClause,
            include: { school: true }
        });
        return NextResponse.json(fees);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch fees' }, { status: 500 });
    }
}
