import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const [totalUsers, totalStudents, totalStaff, totalSchools, recentUsers, transactions, invoices] = await prisma.$transaction([
            prisma.user.count(),
            prisma.user.count({ where: { role: 'STUDENT' } }),
            prisma.user.count({ where: { role: 'STAFF' } }),
            prisma.university.count(),
            prisma.user.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: { id: true, name: true, email: true, role: true, createdAt: true }
            }),
            prisma.transaction.findMany({
                where: { status: 'COMPLETED' },
                select: { amount: true, date: true }
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

        // Calculate payments made today
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const paymentsToday = transactions
            .filter(tx => tx.date.toISOString().startsWith(todayStr))
            .reduce((sum, tx) => sum + tx.amount, 0);

        // Calculate activity for the last 7 days
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);

        const recentTransactionsData = await prisma.transaction.findMany({
            where: {
                date: { gte: last7Days }, // Using 'date' field from schema
                status: 'COMPLETED'
            },
            select: { amount: true, date: true }
        });

        // Aggregate by day
        const activityData = Array.from({ length: 7 }).map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i)); // 6 days ago to today
            const dateStr = d.toISOString().split('T')[0];

            const dailySum = recentTransactionsData
                .filter(t => t.date.toISOString().startsWith(dateStr))
                .reduce((sum, t) => sum + t.amount, 0);

            return {
                date: dateStr,
                day: d.toLocaleDateString('en-US', { weekday: 'short' }),
                amount: dailySum
            };
        });

        return NextResponse.json({
            totalUsers,
            totalStudents,
            totalStaff,
            totalSchools,
            recentUsers,
            totalRevenue,
            outstandingFees,
            paymentsToday,
            activityData
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
