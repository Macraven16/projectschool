import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const [totalUsers, totalStudents, totalStaff, recentUsers, transactions, invoices] = await prisma.$transaction([
            prisma.user.count(),
            prisma.user.count({ where: { role: 'STUDENT' } }),
            prisma.user.count({ where: { role: 'STAFF' } }),
            prisma.user.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: { id: true, name: true, email: true, role: true, createdAt: true }
            }),
            prisma.transaction.findMany({
                where: { status: 'COMPLETED' },
                select: { amount: true }
            }),
            prisma.invoice.findMany({
                where: { status: { not: 'COMPLETED' } },
                select: {
                    amountPaid: true,
                    feeStructure: {
                        select: { amount: true }
                    }
                }
            })
        ]);

        const totalRevenue = transactions.reduce((sum, tx) => sum + tx.amount, 0);
        const outstandingFees = invoices.reduce((sum, inv) => sum + (inv.feeStructure.amount - inv.amountPaid), 0);

        return NextResponse.json({
            totalUsers,
            totalStudents,
            totalStaff,
            recentUsers,
            totalRevenue,
            outstandingFees
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
