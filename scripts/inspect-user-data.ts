import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const targetId = 'cmim3ps5t0001v9pfyr8vg7ce';
    console.log(`Inspecting data for ID: ${targetId}`);

    try {
        // 1. Check if it's a User ID
        const user = await prisma.user.findUnique({
            where: { id: targetId },
            include: {
                student: {
                    include: {
                        wallet: {
                            include: {
                                transactions: true
                            }
                        },
                        school: true
                    }
                }
            }
        });

        if (user) {
            console.log('--- USER FOUND ---');
            console.log(`Name: ${user.name}`);
            console.log(`Role: ${user.role}`);
            console.log(`School ID: ${user.schoolId}`);

            if (user.student) {
                console.log('--- STUDENT PROFILE ---');
                console.log(`Student ID (DB): ${user.student.id}`);
                console.log(`Index Number: ${user.student.studentIdNumber}`);
                console.log(`School: ${user.student.school?.name}`);

                if (user.student.wallet) {
                    console.log('--- WALLET ---');
                    console.log(`Wallet ID: ${user.student.wallet.id}`);
                    console.log(`Balance: ${user.student.wallet.balance}`);
                    console.log(`Transaction Count: ${user.student.wallet.transactions.length}`);
                    user.student.wallet.transactions.forEach(tx => {
                        console.log(`  - ${tx.date.toISOString()} ${tx.type} ${tx.amount} (${tx.status})`);
                    });
                } else {
                    console.log('!!! NO WALLET FOUND !!!');
                }
            } else {
                console.log('!!! NO STUDENT PROFILE FOUND !!!');
            }
            return;
        }

        // 2. Check if it's a Student ID
        const student = await prisma.student.findUnique({
            where: { id: targetId },
            include: {
                user: true,
                wallet: {
                    include: {
                        transactions: true
                    }
                }
            }
        });

        if (student) {
            console.log('--- STUDENT FOUND (by Student ID) ---');
            console.log(`User Name: ${student.user.name}`);
            console.log(`Index Number: ${student.studentIdNumber}`);

            if (student.wallet) {
                console.log('--- WALLET ---');
                console.log(`Wallet ID: ${student.wallet.id}`);
                console.log(`Balance: ${student.wallet.balance}`);
                console.log(`Transaction Count: ${student.wallet.transactions.length}`);
                student.wallet.transactions.forEach(tx => {
                    console.log(`  - ${tx.date.toISOString()} ${tx.type} ${tx.amount} (${tx.status})`);
                });
            } else {
                console.log('!!! NO WALLET FOUND !!!');
            }
        } else {
            console.log('ID not found as User or Student.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
