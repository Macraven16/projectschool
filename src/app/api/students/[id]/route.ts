import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
        }

        // Check if student exists
        const student = await prisma.student.findUnique({
            where: { id },
            include: { user: true } // Include user to delete the user account too if needed
        });

        if (!student) {
            return NextResponse.json({ error: 'Student not found' }, { status: 404 });
        }

        // Transaction to delete student and associated user
        await prisma.$transaction(async (tx) => {
            // Delete student profile
            await tx.student.delete({ where: { id } });

            // Optionally delete the user account if it shouldn't exist without a student profile
            // For now, let's assume we delete the user too to keep things clean
            if (student.userId) {
                await tx.user.delete({ where: { id: student.userId } });
            }
        });

        return NextResponse.json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error('Delete student error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
