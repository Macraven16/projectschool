import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const students = await prisma.student.findMany({
        include: {
            user: true,
            school: true
        }
    });

    console.log(`Total Students: ${students.length}`);
    console.table(students.map(s => ({
        id: s.id,
        name: s.user.name,
        schoolId: s.schoolId,
        schoolName: s.school?.name || 'N/A'
    })));

    const schools = await prisma.university.findMany();
    console.log("\nSchools:");
    console.table(schools.map(s => ({ id: s.id, name: s.name })));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
