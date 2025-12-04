import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserRoleFromRequest, getUserIdFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        const role = getUserRoleFromRequest(request as any);
        if (role !== 'MASTER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const requests = await prisma.deletionRequest.findMany({
            where: { status: 'PENDING' },
            include: {
                student: {
                    include: { user: true }
                },
                staff: true
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(requests);
    } catch (error) {
        console.error('Get requests error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const role = getUserRoleFromRequest(request as any);
        if (role !== 'MASTER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const body = await request.json();
        const { requestId, action } = body; // action: 'APPROVE' | 'REJECT'

        if (!requestId || !action) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const deletionRequest = await prisma.deletionRequest.findUnique({
            where: { id: requestId },
            include: { student: { include: { user: true } } }
        });

        if (!deletionRequest) {
            return NextResponse.json({ error: 'Request not found' }, { status: 404 });
        }

        if (action === 'REJECT') {
            await prisma.deletionRequest.update({
                where: { id: requestId },
                data: { status: 'REJECTED' }
            });
            return NextResponse.json({ message: 'Request rejected' });
        }

        if (action === 'APPROVE') {
            // Transaction to delete student and update request
            await prisma.$transaction(async (tx) => {
                // Delete the student (and user via cascade if set up, but let's be explicit)
                // Note: The schema has onDelete: Cascade for Student -> User relation?
                // Let's check schema: Student -> User (userId). User -> Student?
                // Schema: Student has userId. User has student?.
                // If we delete Student, User might remain unless we delete User.
                // Usually we want to delete the User account too.

                const userId = deletionRequest.student.userId;

                // Delete User (which should cascade delete Student if configured, or we delete Student first)
                // Schema: Student.user -> User (onDelete: Cascade). 
                // Wait, User -> Student is optional. Student -> User is relation.
                // If we delete User, Student is deleted (if Student has onDelete: Cascade on the relation to User).
                // Schema says: `user User @relation(fields: [userId], references: [id], onDelete: Cascade)` in Student model.
                // So deleting User deletes Student.

                await tx.user.delete({ where: { id: userId } });

                // We also need to update the request status, but the request might be deleted if it cascades from Student?
                // Schema: DeletionRequest -> Student (onDelete: Cascade).
                // So if Student is deleted, DeletionRequest is deleted.
                // We can't update it if it's deleted.
                // But we might want to keep a log?
                // If we want to keep the request log, we should remove the cascade or make studentId optional/nullable.
                // For now, let's assume it disappears or we log it to AuditLog before deleting.

                // Let's just let it cascade delete for now as per schema, 
                // OR we can update it to APPROVED *before* deleting, but then it gets deleted.
                // Actually, if we want to keep history, we shouldn't cascade delete DeletionRequest.
                // But I can't change schema right now without another migration.
                // I'll just proceed with deletion.
            });

            return NextResponse.json({ message: 'Request approved and student deleted' });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error('Process request error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
