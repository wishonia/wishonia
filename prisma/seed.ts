import { prisma } from "@/lib/db";

async function main() {
    console.log(`Run tests/seed.test.ts to seed the database.  
    For some reason prisma can't resolve the seeder libraries.`)
}

main()
    .catch((e) => {
        debugger
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });