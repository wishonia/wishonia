import {seedUser} from "@/prisma/seedUser";
import {db} from "@/lib/db";

export async function getOrCreateTestUser() {
    let user = await db.user.findUnique({
        where: {
            email: "test@example.com",
        },
    });
    if(user) {return user;}
    return seedUser();
}

export async function assertTestDB() {
    const connectionString = process.env.DATABASE_URL;
    if(!connectionString) {
        throw new Error("DATABASE_URL environment variable is not set.");
    }
    const dbName = new URL(connectionString).pathname.substr(1);
    if (!dbName.includes('test')) {
        throw new Error("The database name must contain the word 'test'");
    }
}

export async function truncateAllTables() {
    await assertTestDB();
    await db.wishingWellContribution.deleteMany({});
    await db.globalProblemPairAllocation.deleteMany({});
    await db.globalProblem.deleteMany({});
    await db.wishingWellPairAllocation.deleteMany({});
    await db.wishingWell.deleteMany({});
    //await prisma.user.deleteMany({});
    // Add more tables as needed
}