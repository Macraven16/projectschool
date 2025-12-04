import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserIdFromRequest } from '@/lib/auth';

export async function GET(request: any) {
    try {
        console.log("Profile API hit");
        const userId = getUserIdFromRequest(request);
        console.log("User ID from token:", userId);

        if (!userId) {
            console.log("Unauthorized: No user ID found");
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const student = await prisma.student.findUnique({
            where: { userId },
            include: {
                school: true,
                wallet: true,
                user: {
                    select: { name: true, email: true }
                }
            },
        });

        if (!student) {
            console.log("Student profile not found for userId:", userId);
            return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });
        }

        console.log("Student profile found:", student.id);
        return NextResponse.json(student);
    } catch (error) {
        console.error("Profile API Error:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: any) {
    try {
        const userId = getUserIdFromRequest(request);
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const { grade, campus, phone } = body; // Add other fields as needed

        const student = await prisma.student.update({
            where: { userId },
            data: {
                grade,
                campus,
                // phone is not in student model yet, maybe add to User or Student?
                // For now, let's assume we update what we have
            },
        });

        return NextResponse.json(student);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
