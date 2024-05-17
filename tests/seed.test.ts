/**
 * @jest-environment node
 */
import {PrismaClient, User} from "@prisma/client";
import {seedGlobalProblems} from "@/prisma/seedGlobalProblems";
import {seedWishingWells} from "@/prisma/seedWishingWells";
import {seedUser} from "@/prisma/seedUser";
import {seedGlobalProblemPairAllocations} from "@/prisma/seedGlobalProblemPairAllocations";
import {aggregateGlobalProblemPairAllocations} from "@/lib/globalProblems";
import {aggregateWishingWellPairAllocations} from "@/lib/wishingWells";
import {seedWishingWellPairAllocations} from "@/prisma/seedWishingWellPairAllocations";

const prisma = new PrismaClient();
beforeAll(async () => {
    await checkDatabaseName();
    await truncateAllTables();
});
async function createTestUser() {
    let user = await prisma.user.findUnique({
        where: {
            email: "test@example.com",
        },
    });
    if(user) {return user;}
    return seedUser();
}
async function truncateAllTables() {
    await prisma.globalProblemPairAllocation.deleteMany({});
    await prisma.globalProblem.deleteMany({});
    await prisma.wishingWellPairAllocation.deleteMany({});
    await prisma.wishingWell.deleteMany({});
    await prisma.user.deleteMany({});
    // Add more tables as needed
}
async function checkDatabaseName() {
    const connectionString = process.env.DATABASE_URL;
    if(!connectionString) {
        throw new Error("DATABASE_URL environment variable is not set.");
    }
    const dbName = new URL(connectionString).pathname.substr(1);
    if (!dbName.includes('test')) {
        throw new Error("The database name must contain the word 'test'");
    }
}

async function checkGlobalProblems<ExtArgs>(testUser: User) {
    await seedGlobalProblems(testUser);
    await seedGlobalProblemPairAllocations(testUser);
    await aggregateGlobalProblemPairAllocations();
    const globalProblems = await prisma.globalProblem.findMany();
    const total = globalProblems.length;
    const expectedAverageAllocation = 100 / total;
    for (const problem of globalProblems) {
        expect(problem.averageAllocation).toBe(expectedAverageAllocation);
    }
}

async function checkWishingWells<ExtArgs>(testUser: User) {
    await seedWishingWells(testUser);
    await seedWishingWellPairAllocations(testUser);
    await aggregateWishingWellPairAllocations();
    const wishingWells = await prisma.wishingWell.findMany();
    const total = wishingWells.length;
    const expectedAverageAllocation = 100 / total;
    for (const problem of wishingWells) {
        expect(problem.averageAllocation).toBe(expectedAverageAllocation);
    }
}

describe("seedDB", () => {
    it("seeds DB with user, wishing wells and problems", async () => {
        await checkDatabaseName();
        const testUser = await createTestUser();
        await seedWishingWells(testUser);
        await checkGlobalProblems(testUser);
        await checkWishingWells(testUser);
    });
});