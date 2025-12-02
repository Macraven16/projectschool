import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Starting Index Number Generation Test...");

    // 1. Create a test university
    const uniName = "Test University " + Math.floor(Math.random() * 1000);
    const uniCode = "TEST";

    let university = await prisma.university.create({
        data: {
            name: uniName,
            code: uniCode,
            verified: true
        }
    });

    console.log(`Created University: ${university.name} (${university.code})`);

    // 2. Create multiple students concurrently
    const studentCount = 5;
    const promises = [];

    for (let i = 0; i < studentCount; i++) {
        const payload = {
            name: `Test Student ${i}`,
            email: `teststudent${i}_${Date.now()}@example.com`,
            password: "password123",
            schoolId: university.id,
            department: "CS",
            course: "IT"
        };

        promises.push(
            fetch('http://localhost:3000/api/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }).then(res => res.json())
        );
    }

    const results = await Promise.all(promises);

    console.log("Creation Results:");
    results.forEach((res, index) => {
        if (res.error) {
            console.error(`Student ${index} failed:`, res.error);
        } else {
            console.log(`Student ${index} created: ${res.studentIdNumber}`);
        }
    });

    // 3. Verify uniqueness and format
    const ids = results.filter(r => !r.error).map(r => r.studentIdNumber);
    const uniqueIds = new Set(ids);

    if (ids.length === uniqueIds.size) {
        console.log("SUCCESS: All Index Numbers are unique.");
    } else {
        console.error("FAILURE: Duplicate Index Numbers detected.");
    }

    // Cleanup
    // await prisma.student.deleteMany({ where: { schoolId: university.id } });
    // await prisma.university.delete({ where: { id: university.id } });
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
