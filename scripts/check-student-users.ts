import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        where: { role: 'STUDENT' },
        include: { student: true }
    });

    console.log(`Users with role STUDENT: ${users.length}`);
    console.table(users.map(u => ({
        email: u.email,
        name: u.name,
        hasStudentProfile: !!u.student
    })));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
