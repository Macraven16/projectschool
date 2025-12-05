import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, signToken } from '@/lib/auth';
import { backfillInvoicesForStudent } from '@/lib/fees';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, name, role, university, indexNumber, phone, campus, grade } = body;

        if (!email || !password || !name) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await hashPassword(password);

        // Create User
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: role || 'STUDENT',
            },
        });

        // If Student, create Student profile and Wallet
        if (user.role === 'STUDENT') {
            // Find school ID by name or create if not exists
            let schoolId = '';

            if (university) {
                let school = await prisma.university.findFirst({
                    where: { name: { equals: university, mode: 'insensitive' } },
                });

                if (!school) {
                    // Create new university if it doesn't exist (handling "Other" case)
                    // Generate a simple code based on name
                    const code = university.substring(0, 4).toUpperCase() + Math.floor(Math.random() * 1000);
                    school = await prisma.university.create({
                        data: {
                            name: university,
                            code: code,
                            verified: false // New schools are unverified by default
                        }
                    });
                }
                schoolId = school.id;
            }

            // Fallback to first university if no specific one found (should be rare now)
            if (!schoolId) {
                const firstSchool = await prisma.university.findFirst();
                if (firstSchool) schoolId = firstSchool.id;
            }

            if (schoolId) {
                // Update User with schoolId
                await prisma.user.update({
                    where: { id: user.id },
                    data: { schoolId: schoolId }
                });

                const student = await prisma.student.create({
                    data: {
                        userId: user.id,
                        schoolId: schoolId,
                        studentIdNumber: indexNumber || `ID-${Date.now()}`,
                        grade: grade || 'Level 100',
                        campus: campus || 'Main Campus',
                        department: body.department,
                        course: body.course,
                        wallet: {
                            create: {
                                balance: 0.0,
                            },
                        },
                    },
                });

                // Backfill invoices for the new student
                await backfillInvoicesForStudent(student.id, schoolId);
            }
        }

        // Generate Token
        const token = signToken({ userId: user.id, email: user.email, role: user.role });

        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
            token,
        });
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
