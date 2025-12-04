
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    try {
        const userCount = await prisma.user.count();
        console.log(`Database is connected. Total users: ${userCount}`);

        const schools = await prisma.university.count();
        console.log(`Total schools: ${schools}`);

    } catch (e) {
        console.error("Database connection failed:", e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
