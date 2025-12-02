import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const studentId = 'cmim3ps5t0001v9pfyr8vg7ce';
    const newIndexNumber = 'GCTU-4211231138';

    console.log(`Updating student index number for Student ID: ${studentId} to ${newIndexNumber} `);

    try {
        const updatedStudent = await prisma.student.update({
            where: { id: studentId },
            data: {
                studentIdNumber: newIndexNumber
            }
        });

        console.log('Successfully updated student record:');
        console.log(`- ID: ${updatedStudent.id} `);
        console.log(`- New Index Number: ${updatedStudent.studentIdNumber} `);

    } catch (error) {
        console.error('Error updating student:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
