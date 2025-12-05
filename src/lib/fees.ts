import { prisma } from '@/lib/prisma';

/**
 * Backfills invoices for a student for all existing fee structures of their school.
 * Useful when a student is newly created or assigned to a school.
 */
export async function backfillInvoicesForStudent(studentId: string, schoolId: string) {
    try {
        console.log(`Backfilling invoices for student ${studentId} in school ${schoolId}`);

        // 1. Get all fee structures for this school
        const feeStructures = await prisma.feeStructure.findMany({
            where: { schoolId },
        });

        if (feeStructures.length === 0) {
            console.log("No fee structures found for this school.");
            return;
        }

        // 2. Check which invoices the student already has
        const existingInvoices = await prisma.invoice.findMany({
            where: {
                studentId,
                feeStructureId: { in: feeStructures.map(f => f.id) }
            },
            select: { feeStructureId: true }
        });

        const existingFeeIds = new Set(existingInvoices.map(i => i.feeStructureId));

        // 3. Filter out fees the student already has
        const feesToAssign = feeStructures.filter(f => !existingFeeIds.has(f.id));

        if (feesToAssign.length === 0) {
            console.log("Student already has all applicable invoices.");
            return;
        }

        // 4. Create missing invoices
        await prisma.invoice.createMany({
            data: feesToAssign.map(fee => ({
                studentId,
                feeStructureId: fee.id,
                amountPaid: 0.0,
                status: 'PENDING',
            }))
        });

        console.log(`Created ${feesToAssign.length} invoices for student ${studentId}`);
    } catch (error) {
        console.error("Error backfilling invoices:", error);
        // Don't throw, just log, so we don't block the main flow
    }
}
