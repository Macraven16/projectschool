import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // Simple query to verify DB connection and get counts
        const userCount = await prisma.user.count();
        const feeCount = await prisma.feeStructure.count();
        const studentCount = await prisma.student.count();

        return NextResponse.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            db: {
                connected: true,
                users: userCount,
                fees: feeCount,
                students: studentCount
            }
        });
    } catch (error) {
        console.error('Health check failed:', error);
        return NextResponse.json({
            status: 'unhealthy',
            error: 'Database connection failed'
        }, { status: 500 });
    }
}
