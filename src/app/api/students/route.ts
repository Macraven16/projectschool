import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        const students = await prisma.student.findMany({
            include: {
                user: true,
                school: true,
                wallet: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(students);
    } catch (error) {
        console.error('Get students error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, name, schoolId, studentIdNumber, grade, campus } = body;

        if (!email || !password || !name || !schoolId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Create User first
        const hashedPassword = await hashPassword(password);

        // Transaction to ensure both user and student are created
        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    role: 'STUDENT',
                },
            });

            // 1. Get or Create School
            let finalSchoolId = schoolId;
            let schoolCode = 'UNIV';

            if (schoolId === 'other' || !schoolId) {
                // @ts-ignore
                const schoolName = body.schoolName;
                if (!schoolName) throw new Error("School Name is required for 'Other'");

                // Check if exists
                let school = await tx.university.findFirst({
                    where: { name: { equals: schoolName, mode: 'insensitive' } }
                });

                if (!school) {
                    // Create new
                    const code = schoolName.substring(0, 4).toUpperCase() + Math.floor(Math.random() * 1000);
                    school = await tx.university.create({
                        data: {
                            name: schoolName,
                            code: code,
                            verified: false
                        }
                    });
                }
                finalSchoolId = school.id;
                schoolCode = school.code;
            } else {
                const school = await tx.university.findUnique({
                    where: { id: schoolId },
                    select: { code: true }
                });
                schoolCode = school?.code || 'UNIV';
            }

            // 2. Generate Sequence with Retry Logic
            let generatedIndexNumber = "";
            let isUnique = false;
            let retryCount = 0;
            const maxRetries = 5;

            while (!isUnique && retryCount < maxRetries) {
                const count = await tx.student.count({
                    where: { schoolId: finalSchoolId }
                });
                // Add retryCount to sequence to avoid collision on same count
                const sequence = (count + 1 + retryCount).toString().padStart(4, '0');
                const year = new Date().getFullYear();
                generatedIndexNumber = `${schoolCode}-${year}-${sequence}`;

                // Check if this index already exists
                const existing = await tx.student.findUnique({
                    where: { studentIdNumber: generatedIndexNumber }
                });

                if (!existing) {
                    isUnique = true;
                } else {
                    retryCount++;
                }
            }

            if (!isUnique) {
                // Fallback to random if sequence fails repeatedly
                const random = Math.floor(1000 + Math.random() * 9000);
                generatedIndexNumber = `${schoolCode}-${new Date().getFullYear()}-${random}`;
            }

            const student = await tx.student.create({
                data: {
                    userId: user.id,
                    schoolId: finalSchoolId,
                    studentIdNumber: studentIdNumber || generatedIndexNumber,
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
                include: {
                    user: true,
                    school: true,
                }
            });

            // 3. Auto-generate Invoices for existing Fee Structures
            const schoolFees = await tx.feeStructure.findMany({
                where: { schoolId: finalSchoolId }
            });

            if (schoolFees.length > 0) {
                await tx.invoice.createMany({
                    data: schoolFees.map(fee => ({
                        studentId: student.id,
                        feeStructureId: fee.id,
                        amountPaid: 0.0,
                        status: 'PENDING'
                    }))
                });
            }

            return student;
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error('Create student error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
