/**
 * @jest-environment node
 */
import {User} from "@prisma/client";
import {prisma} from "@/lib/db";
import {createGlobalProblemSolution, generateGlobalProblemSolutions} from "@/lib/globalProblemSolutionGenerator";
import {globalSolutionNames} from "@/prisma/seeds/globalSolutionNames";
import {seedGlobalProblemSolutionPairAllocations} from "@/prisma/seedGlobalProblemSolutionPairAllocations";
import {assertTestDB, getOrCreateTestUser, truncateAllTables} from "@/tests/test-helpers";
import {
    generalizeGlobalSolutionDescriptions,
    generateGlobalSolutionImages,
    generateGlobalSolutions
} from "@/lib/globalSolutionsGenerator";
import {aggregateGlobalSolutionPairAllocations, dumpGlobalSolutionNames} from "@/lib/globalSolutions";
import {aggregateGlobalProblemSolutionPairAllocations} from "@/lib/globalProblemSolutionPairAllocations";
import {seedGlobalProblemPairAllocations} from "@/prisma/seedGlobalProblemPairAllocations";
import {seedGlobalSolutions} from "@/prisma/seedGlobalSolutions";
import {loadJsonToDatabase} from "@/lib/prisma/loadDatabaseFromJson";
import {seedGlobalSolutionPairAllocations} from "@/prisma/seedGlobalSolutionPairAllocations";
import {seedGlobalProblemsFromMarkdown} from "@/prisma/seedGlobalProblemsFromMarkdown";
import {aggregateGlobalProblemPairAllocations} from "@/lib/globalProblems";

describe("Global Problem Solutions", () => {
    jest.setTimeout(6000000);
    it("Adds missing images to GlobalProblemSolutions", async () => {
        const globalProblemSolutions =
            await prisma.globalProblemSolution.findMany({
                where: {
                    globalProblemId: 'aging'
                }
            });
        for (const globalProblemSolution of globalProblemSolutions) {
            const globalSolution = await prisma.globalSolution.findFirst({
                where: {
                    id: globalProblemSolution.globalSolutionId
                }
            });
            if (!globalSolution) throw new Error("Global Problem not found");
            if(!globalSolution.featuredImage) throw new Error("Global Problem has no featured image");
            await prisma.globalProblemSolution.update({
                where: {
                    id: globalProblemSolution.id
                },
                data: {
                    featuredImage: globalSolution.featuredImage
                }
            });
        }
    });
    it("Aggregates GlobalProblemSolutionPairAllocations", async () => {
        await seedGlobalProblemSolutionPairAllocations(await getOrCreateTestUser());
        await aggregateGlobalProblemSolutionPairAllocations();
    });
    it("Creates Global Problem Solutions for Aging", async () => {
        const globalProblem = await prisma.globalProblem.findFirst({
            where: {
                name: "Aging"
            }
        });
        if (!globalProblem) throw new Error("Global Problem Aging not found");
        for (const title of globalSolutionNames.aging) {
            await createGlobalProblemSolution(title, null, globalProblem);
        }
    });
    it("Dumps the names of the global solutions", async () => {
        await dumpGlobalSolutionNames();
    });
    it("Generates GlobalSolution images", async () => {
        await generateGlobalSolutionImages();
    }, 6000000);
    it("Creates global problem solutions from names", async () => {
        const globalProblem = await prisma.globalProblem.findFirst({
            where: {
                name: "Aging"
            }
        });
        if (!globalProblem) throw new Error("Global Problem Aging not found");
        for (const globalSolutionName of globalSolutionNames.aging) {
            await createGlobalProblemSolution(globalSolutionName,
                null, globalProblem)
        }
        await seedGlobalProblemSolutionPairAllocations(await getOrCreateTestUser());
    });
    it("Generates Global Problem Pair Allocations", async () => {
        await seedGlobalProblemPairAllocations(await getOrCreateTestUser());
    });
    it("Generates GlobalProblemSolutions", async () => {
        await checkGlobalSolutions(await getOrCreateTestUser());
    });
    it("seeds DB with user, wishing wells and problems", async () => {
        await assertTestDB();
        await truncateAllTables();
        const testUser = await getOrCreateTestUser();
        await checkGlobalProblems(testUser);
        await checkGlobalSolutions(testUser);
    }, 45000);

    it("Seed GlobalProblemSolutions", async () => {
        await checkGlobalProblemSolutions(await getOrCreateTestUser());
    });
    it("Aggregates global problem pair allocations", async () => {
        await aggregateGlobalProblemSolutionPairAllocations();
    });
    it("Seed global problems and solutions", async () => {
        await loadJsonToDatabase("GlobalProblemSolution");
    }, 6000000);
    it("Generate global solutions", async () => {
        await generateGlobalSolutions();
    }, 6000000);
    it("Seed global solutions", async () => {
        await checkGlobalSolutions(await getOrCreateTestUser());
    }, 6000000);
    it("Generates GlobalProblemSolutions", async () => {
        await generateGlobalProblemSolutions();
    }, 6000000);
    it("Generalizes the GlobalSolution descriptions", async () => {
        await generalizeGlobalSolutionDescriptions();
    });
});

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


async function checkGlobalProblems<ExtArgs>(testUser: User) {
    console.log("Checking global problems");
    console.log("Seeding global problems");
    await seedGlobalProblemsFromMarkdown(testUser);
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
