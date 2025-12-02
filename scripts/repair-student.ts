import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'testuser@student.com';
    const schoolId = 'cmim1jqgi000012e3xk6zf7ac'; // GCTU

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        console.error('User not found');
        return;
    }

    console.log(`Creating Student profile for ${user.name}...`);

    const student = await prisma.student.create({
        data: {
            userId: user.id,
            schoolId: schoolId,
            studentIdNumber: 'GCTU-2025-0001', // Manual fix
            grade: 'Level 100',
            campus: 'Main Campus',
            wallet: {
                create: {
                    balance: 0.0,
                },
            },
        }
    });

    console.log('Student profile created:', student.id);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
