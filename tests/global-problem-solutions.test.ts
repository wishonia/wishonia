/**
 * @jest-environment node
 */
import {PrismaClient} from "@prisma/client";
import {createGlobalProblemSolution} from "@/lib/globalProblemSolutionGenerator";
import {globalSolutionNames} from "@/prisma/seeds/globalSolutionNames";
import {seedGlobalProblemSolutionPairAllocations} from "@/prisma/seedGlobalProblemSolutionPairAllocations";
import {getOrCreateTestUser} from "@/tests/test-helpers";
import {generateGlobalSolutionImages} from "@/lib/globalSolutionsGenerator";
import {dumpGlobalSolutionNames} from "@/lib/globalSolutions";
import {aggregateGlobalProblemSolutionPairAllocations} from "@/lib/globalProblemSolutionPairAllocations";
let prisma = new PrismaClient();

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
});