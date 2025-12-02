import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const transactions = await prisma.transaction.findMany({
            include: {
                wallet: {
                    include: {
                        student: {
                            include: {
                                user: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                date: 'desc'
            }
        });

        console.log(`Found ${transactions.length} transactions:`);
        transactions.forEach(tx => {
            console.log(`- [${tx.date.toISOString()}] ${tx.type} ${tx.amount} (${tx.status}) - Student: ${tx.wallet?.student?.user?.name || 'Unknown'}`);
        });

    } catch (error) {
        console.error('Error checking transactions:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
