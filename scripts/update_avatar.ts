import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const email = 'nii.admin@raventech.com.gh';
    const password = 'SecurePassword123!';
    const hashedPassword = await bcrypt.hash(password, 10);
    const image = '/team/isaac.jpg';
    const name = 'Isaac Nii Hammond';

    console.log(`Upserting user ${email}...`);

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            image,
            name, // Ensure name matches team member
            role: 'MASTER_ADMIN', // Assuming admin role based on email
        },
        create: {
            email,
            name,
            password: hashedPassword,
            role: 'MASTER_ADMIN',
            image,
        },
    });

    console.log(`User ${user.email} updated/created with avatar: ${user.image}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
