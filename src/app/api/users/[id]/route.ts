import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserRoleFromRequest, getUserIdFromRequest } from '@/lib/auth';
import { createAuditLog } from '@/lib/audit';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const role = getUserRoleFromRequest(request as any);
        const requesterId = getUserIdFromRequest(request as any);

        if (!role || !requesterId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

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

        // RBAC Logic
        if (role === 'STAFF') {
            if (user.role !== 'STUDENT') {
                return NextResponse.json({ error: 'Staff can only manage students' }, { status: 403 });
            }
            // Create Deletion Request instead of deleting
            await prisma.deletionRequest.create({
                data: {
                    studentId: user.student!.id, // Assuming student exists if role is STUDENT
                    staffId: requesterId,
                    reason: 'Staff requested deletion',
                    status: 'PENDING'
                }
            });
            return NextResponse.json({ message: 'Deletion request sent for approval' }, { status: 202 });
        }

        if (role === 'MASTER_ADMIN') {
            // Master Admin can delete anyone
        } else if (role === 'ADMIN') {
            if (user.role === 'MASTER_ADMIN') {
                return NextResponse.json({ error: 'Cannot delete Master Admin' }, { status: 403 });
            }
            if (user.role === 'ADMIN') {
                // Optional: Prevent Admin from deleting other Admins if that's the policy, 
                // but user asked why Master Admin can't delete Admin.
            }
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

        await createAuditLog(requesterId, 'DELETE_USER', `Deleted user ${user.email} (${user.role})`);

        return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, email, role, schoolId, indexNumber } = body;

        if (!id) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        // Update user and related student record in a transaction
        const updatedUser = await prisma.$transaction(async (tx) => {
            const user = await tx.user.update({
                where: { id },
                data: {
                    name,
                    email,
                    role,
                    schoolId: schoolId || null
                }
            });

            // If user is a student and index number is provided, update/create student record
            if (role === 'STUDENT' && indexNumber) {
                await tx.student.upsert({
                    where: { userId: id },
                    create: {
                        userId: id,
                        studentIdNumber: indexNumber,
                        schoolId: schoolId || user.schoolId, // Use provided schoolId or existing
                        grade: "N/A" // Default grade as it's required
                    },
                    update: {
                        studentIdNumber: indexNumber,
                        schoolId: schoolId || undefined
                    }
                });
            }

            return user;
        });

        // Log action
        const requesterId = getUserIdFromRequest(request as any);
        if (requesterId) {
            await createAuditLog(requesterId, 'UPDATE_USER', `Updated user ${updatedUser.email} (${updatedUser.role})`);
        }

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('Update user error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
