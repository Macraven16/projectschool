
const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@raventech.com.gh';
    const password = 'SecurePassword123!';
    const name = 'RavenTech Master Admin';
    const role = 'MASTER_ADMIN';

    const hashedPassword = await hash(password, 12);

    try {
        const user = await prisma.user.upsert({
            where: { email },
            update: {
                password: hashedPassword,
                role: role,
                name: name,
            },
            create: {
                email,
                password: hashedPassword,
                name,
                role,
            },
        });
        console.log(`Created/Updated Master Admin: ${user.email}`);
    } catch (e) {
        console.error(e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
