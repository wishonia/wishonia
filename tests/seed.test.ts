/**
 * @jest-environment node
 */
import {PrismaClient, User} from "@prisma/client";
import {seedGlobalProblems} from "@/prisma/seedGlobalProblems";
import {seedWishingWells} from "@/prisma/seedWishingWells";
import {seedGlobalProblemPairAllocations} from "@/prisma/seedGlobalProblemPairAllocations";
import {aggregateGlobalProblemPairAllocations} from "@/lib/globalProblems";
import {aggregateWishingWellPairAllocations} from "@/lib/wishingWells";
import {seedWishingWellPairAllocations} from "@/prisma/seedWishingWellPairAllocations";
import {assertTestDB, getOrCreateTestUser, truncateAllTables} from "@/tests/test-helpers";

let prisma = new PrismaClient();
beforeAll(async () => {
    await assertTestDB();
});

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
    const roundedAverageAllocation = Math.round(expectedAverageAllocation);
    for (const problem of wishingWells) {
        if(!problem.averageAllocation) {
            throw new Error("Problem does not have an average allocation");
        }
        const wellRoundedAllocation = Math.round(problem.averageAllocation);
        expect(wellRoundedAllocation).toBe(roundedAverageAllocation);
    }
}

describe("Database-related tests", () => {
    it("seeds DB with user, wishing wells and problems", async () => {
        await assertTestDB();
        await truncateAllTables();
        const testUser = await getOrCreateTestUser();
        await checkWishingWells(testUser);
        await checkGlobalProblems(testUser);
    }, 45000);
    it("Seed wishing wells", async () => {
        const testUser = await getOrCreateTestUser();
        await checkWishingWells(testUser);
        //await checkGlobalProblems(testUser);
    }, 45000);
});