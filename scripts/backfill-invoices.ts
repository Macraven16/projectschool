import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Starting Invoice Backfill...");

    // 1. Get all Fee Structures
    const fees = await prisma.feeStructure.findMany();
    console.log(`Found ${fees.length} Fee Structures.`);

    for (const fee of fees) {
        console.log(`Processing Fee: ${fee.name} (School ID: ${fee.schoolId})`);

        // 2. Get all students in the fee's school
        const students = await prisma.student.findMany({
            where: { schoolId: fee.schoolId }
        });
        console.log(`  - Found ${students.length} students in this school.`);

        for (const student of students) {
            // 3. Check if invoice already exists
            const existingInvoice = await prisma.invoice.findFirst({
                where: {
                    studentId: student.id,
                    feeStructureId: fee.id
                }
            });

            if (!existingInvoice) {
                console.log(`  - Creating invoice for student ${student.id}...`);
                await prisma.invoice.create({
                    data: {
                        studentId: student.id,
                        feeStructureId: fee.id,
                        amountPaid: 0.0,
                        status: 'PENDING'
                    }
                });
            } else {
                console.log(`  - Invoice already exists for student ${student.id}. Skipping.`);
            }
        }
    }

    console.log("Backfill complete!");
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
