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
import {
    generalizeGlobalSolutionDescriptions,
    generateGlobalSolutionImages,
    generateGlobalSolutions
} from "@/lib/globalSolutionsGenerator";
import {loadJsonToDatabase} from "@/lib/prisma/dumpDatabaseToJson";
import {seedGlobalSolutions} from "@/prisma/seedGlobalSolutions";
import {aggregateGlobalSolutionPairAllocations} from "@/lib/globalSolutions";
import {seedGlobalSolutionPairAllocations} from "@/prisma/seedGlobalSolutionPairAllocations";
import {generateGlobalProblemSolutions} from "@/lib/globalProblemSolutionGenerator";
import {aggregateGlobalProblemSolutionPairAllocations} from "@/lib/globalProblemSolutions";
import {seedGlobalProblemSolutionPairAllocations} from "@/prisma/seedGlobalProblemSolutionPairAllocations";


let prisma = new PrismaClient();
beforeAll(async () => {
    await assertTestDB();
});

async function installPgVector() {
    await prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS vector`;
}

describe("Database-seeder tests", () => {
    jest.setTimeout(6000000);
    it("seeds DB with user, wishing wells and problems", async () => {
        await installPgVector();
        await assertTestDB();
        await truncateAllTables();
        const testUser = await getOrCreateTestUser();
        await checkWishingWells(testUser);
        await checkGlobalProblems(testUser);
        await checkGlobalSolutions(testUser);
    }, 45000);
    it("Seed wishing wells", async () => {
        const testUser = await getOrCreateTestUser();
        await checkWishingWells(testUser);
    }, 45000);
    it("Seed GlobalProblemSolutions", async () => {
        await checkGlobalProblemSolutions(await getOrCreateTestUser());
    });
    it("Seed GlobalProblemSolutions", async () => {
        await checkGlobalProblemSolutions(await getOrCreateTestUser());
    });
    it("Aggregates global problem pair allocations", async () => {
        await aggregateGlobalProblemSolutionPairAllocations();
    });
    it("Seed global problems and solutions", async () => {
        await loadJsonToDatabase("GlobalProblemSolution");
        return;
        // const testUser = await getOrCreateTestUser();
        // await checkGlobalProblems(testUser);
        // const globalSolutions =  await generateGlobalSolutions();
    }, 6000000);
    it("Generate global solutions", async () => {
        await generateGlobalSolutions();
    }, 6000000);
    it("Seed global solutions", async () => {
        await checkGlobalSolutions(await getOrCreateTestUser());
    }, 6000000);
    it("Generates GlobalSolution images", async () => {
        await generateGlobalSolutionImages();
    }, 6000000);
    it("Generates GlobalProblemSolutions", async () => {
        await generateGlobalProblemSolutions();
    }, 6000000);
    it("updates globalProblemIds on GlobalProblemSolutionPairAllocation", async () => {
        const globalProblemSolutionPairAllocations =
            await prisma.globalProblemSolutionPairAllocation.findMany({
                where: {
                    globalProblemId: null
                },
                include: {
                    thisGlobalProblemSolution: true,
                    thatGlobalProblemSolution: true
                }
            });
        for (const allocation of globalProblemSolutionPairAllocations) {
            const thisGlobalProblemSolution = allocation.thisGlobalProblemSolution;
            const thatGlobalProblemSolution = allocation.thatGlobalProblemSolution;
            if(thisGlobalProblemSolution.globalProblemId !== thatGlobalProblemSolution.globalProblemId) {
                const thisGlobalProblem = await prisma.globalProblem.findUnique({
                    where: {
                        id: thisGlobalProblemSolution.globalProblemId
                    }
                });
                const thatGlobalProblem = await prisma.globalProblem.findUnique({
                    where: {
                        id: thatGlobalProblemSolution.globalProblemId
                    }
                });
                throw new Error("GlobalProblemIds do not match");
            }
            await prisma.globalProblemSolutionPairAllocation.update({
                where: {
                    id: allocation.id
                },
                data: {
                    globalProblemId: thatGlobalProblemSolution.globalProblemId
                }
            });
        }
    });
    it("Generalizes the GlobalSolution descriptions", async () => {
        await generalizeGlobalSolutionDescriptions();
    });
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

async function checkGlobalProblemSolutions<ExtArgs>(testUser: User) {
    console.log("Checking globalProblemSolutions");
    console.log("Seeding globalProblemSolutions");
    //await seedGlobalProblemSolutions(testUser);
    console.log("Seeded globalProblemSolutions");
    console.log("Seeding globalProblemSolution pair allocations");
    await seedGlobalProblemSolutionPairAllocations(testUser);
    console.log("Seeded globalProblemSolution pair allocations");
    console.log("Aggregating globalProblemSolution pair allocations");
    await aggregateGlobalProblemSolutionPairAllocations();
    console.log("Aggregated globalProblemSolution pair allocations");
    const globalProblemSolutions = await prisma.globalProblemSolution.findMany();
    const total = globalProblemSolutions.length;
    const expectedAverageAllocation = 100 / total;
    for (const problem of globalProblemSolutions) {
        expect(problem.averageAllocation).toBe(expectedAverageAllocation);
    }
}

async function checkGlobalSolutions<ExtArgs>(testUser: User) {
    console.log("Checking global solutions");
    console.log("Seeding global solutions");
    await seedGlobalSolutions(testUser);
    await loadJsonToDatabase("GlobalProblemSolution");
    console.log("Seeded global solutions");
    console.log("Seeding global solution pair allocations");
    await seedGlobalSolutionPairAllocations(testUser);
    console.log("Seeded global solution pair allocations");
    console.log("Aggregating global solution pair allocations");
    await aggregateGlobalSolutionPairAllocations();
    console.log("Aggregated global solution pair allocations");
    const globalSolutions = await prisma.globalSolution.findMany();
    const total = globalSolutions.length;
    const expectedAverageAllocation = 100 / total;
    for (const problem of globalSolutions) {
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
