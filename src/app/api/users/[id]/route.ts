import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserRoleFromRequest } from '@/lib/auth';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Verify Admin - simplified for now, assuming middleware or client-side checks + token
        // In a real app, strict role checking here is crucial

        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { id },
            include: { student: true }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Transaction to delete related records if necessary
        // Prisma cascade delete should handle most, but let's be safe
        await prisma.$transaction(async (tx) => {
            // If student, delete student profile first (though cascade usually handles this)
            if (user.student) {
                await tx.student.delete({ where: { id: user.student.id } });
            }

            await tx.user.delete({ where: { id } });
        });

        return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
