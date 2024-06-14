/**
 * @jest-environment node
 */
import {PrismaClient} from "@prisma/client";
import {createGlobalProblemSolution} from "@/lib/globalProblemSolutionGenerator";
import {globalSolutionNames} from "@/prisma/seeds/globalSolutionNames";
let prisma = new PrismaClient();

describe("Global Problem Solutions", () => {
    jest.setTimeout(6000000);
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
});