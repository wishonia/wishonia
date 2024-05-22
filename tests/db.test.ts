/**
 * @jest-environment node
 */
import {PrismaClient, User} from "@prisma/client";
import {seedGlobalProblems} from "@/prisma/seedGlobalProblems";
import {seedWishingWells} from "@/prisma/seedWishingWells";
import {seedUser} from "@/prisma/seedUser";
import {seedGlobalProblemPairAllocations} from "@/prisma/seedGlobalProblemPairAllocations";
import {aggregateGlobalProblemPairAllocations} from "@/lib/globalProblems";
import {aggregateWishingWellPairAllocations, saveWishToWishingWell} from "@/lib/wishingWells";
import {seedWishingWellPairAllocations} from "@/prisma/seedWishingWellPairAllocations";

let prisma = new PrismaClient();
beforeAll(async () => {
    process.env.DATABASE_URL = "postgresql://user:pass@localhost:5432/wishonia_test?schema=public";
    if(!prisma){
        prisma = new PrismaClient();
    }
    await checkDatabaseName();
});
async function getOrCreateTestUser() {
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
    //await prisma.user.deleteMany({});
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
    console.log("Checking global problems");
    console.log("Seeding global problems");
    await seedGlobalProblems(testUser);
    console.log("Seeded global problems");
    console.log("Seeding global problem pair allocations");
    await seedGlobalProblemPairAllocations(testUser);
    console.log("Seeded global problem pair allocations");
    console.log("Aggregating global problem pair allocations");
    await aggregateGlobalProblemPairAllocations();
    console.log("Aggregated global problem pair allocations");
    const globalProblems = await prisma.globalProblem.findMany();
    const total = globalProblems.length;
    const expectedAverageAllocation = 100 / total;
    for (const problem of globalProblems) {
        expect(problem.averageAllocation).toBe(expectedAverageAllocation);
    }
}

async function checkWishingWells<ExtArgs>(testUser: User) {
    console.log("Checking wishing wells");
    await seedWishingWells(testUser);
    console.log("Seeded wishing wells");
    console.log("Seeding wishing well pair allocations");
    await seedWishingWellPairAllocations(testUser);
    console.log("Seeded wishing well pair allocations");
    console.log("Aggregating wishing well pair allocations")
    await aggregateWishingWellPairAllocations();
    console.log("Aggregated wishing well pair allocations")
    const wishingWells = await prisma.wishingWell.findMany();
    const total = wishingWells.length;
    const expectedAverageAllocation = 100 / total;
    for (const problem of wishingWells) {
        expect(problem.averageAllocation).toBe(expectedAverageAllocation);
    }
}

describe("Database-related tests", () => {
    it("seeds DB with user, wishing wells and problems", async () => {
        await checkDatabaseName();
        await truncateAllTables();
        const testUser = await getOrCreateTestUser();
        await checkWishingWells(testUser);
        await checkGlobalProblems(testUser);
    }, 45000);
    it("averages wishingWell allocations", async () => {
        const testUser = await getOrCreateTestUser();
        await prisma.wishingWellPairAllocation.deleteMany({});
        await seedWishingWellPairAllocations(testUser);
        await aggregateWishingWellPairAllocations();
        const wishingWells = await prisma.wishingWell.findMany();
        for (const wishingWell of wishingWells) {
            expect(wishingWell.averageAllocation).toBe(100 / wishingWells.length);
        }
    });
    it("averages globalProblem allocations", async () => {
        const testUser = await getOrCreateTestUser();
        await prisma.globalProblemPairAllocation.deleteMany({});
        await seedGlobalProblemPairAllocations(testUser);
        await aggregateGlobalProblemPairAllocations();
        const globalProblems = await prisma.globalProblem.findMany();
        for (const globalProblem of globalProblems) {
            expect(globalProblem.averageAllocation).toBe(100 / globalProblems.length);
        }
    });
    it("Converts a wish to a wishingWell", async () => {
        const testUser = await getOrCreateTestUser();
        const obj = await saveWishToWishingWell("I wish for world peace", testUser.id);
        expect(obj).toHaveProperty("description");
        expect(obj).toHaveProperty("name");
        expect(obj).toHaveProperty("content");
    });
});