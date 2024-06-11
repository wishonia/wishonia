import {GlobalProblem, GlobalProblemSolution} from "@prisma/client";
import { prisma } from "@/lib/db";

async function getRandomGlobalProblemSolutionsForUser(globalProblemId: string,
                                                      userId: string): Promise<{ id: string }[]> {
    const existingGlobalProblemSolutionPairAllocationIds =
        await getGlobalProblemSolutionPairAllocationIdsForUserAndGlobalProblem(
        userId, globalProblemId);

    return prisma.$queryRaw`
        SELECT id
        FROM "GlobalProblemSolution"
        WHERE id NOT IN (SELECT "thisGlobalProblemSolutionId"
                         FROM "GlobalProblemSolutionPairAllocation"
                         WHERE "GlobalProblemSolutionPairAllocation"."userId" = ${userId}
                         AND "GlobalProblemSolutionPairAllocation"."globalProblemId" = ${globalProblemId}
                         UNION
                         SELECT "thatGlobalProblemSolutionId"
                         FROM "GlobalProblemSolutionPairAllocation"
                         WHERE "GlobalProblemSolutionPairAllocation"."userId" = ${userId})
        ORDER BY random()
        LIMIT 2;
    `;
}

async function getRandomGlobalProblemSolutionsAnonymous(globalProblemId: string): Promise<{ id: string }[]> {
    return prisma.$queryRaw`
        SELECT id
        FROM "GlobalProblemSolution"
        WHERE "globalProblemId" = ${globalProblemId}
        ORDER BY random()
        LIMIT 2;
    `;
}

function createWhereClause(ids: { id: string }[]) {
    const where = [];
    for (let i = 0; i < ids.length; i++) {
        where.push(ids[i].id);
    }
    return where;
}

export async function getRandomGlobalProblemSolutionPair(globalProblemId: string, userId: string | undefined) {
    let ids: { id: string }[] = [];
    if (userId) {
        ids = await getRandomGlobalProblemSolutionsForUser(globalProblemId, userId);
    } else {
        ids = await getRandomGlobalProblemSolutionsAnonymous(globalProblemId);
    }
    const where = createWhereClause(ids);
    return prisma.globalProblemSolution.findMany({
        where: {
            id: {
                in: where
            }
        }
    });
}

export async function getAllRandomGlobalProblemSolutionPairs() {
    const globalProblems = await prisma.globalProblem.findMany();
    const pairs: {
        thisGlobalProblemSolution: GlobalProblemSolution,
        thatGlobalProblemSolution: GlobalProblemSolution,
        globalProblem: GlobalProblem
    }[] = [];
    // Loop through all global problems and get random pairs of global problem solutions
    for (const globalProblem of globalProblems) {
        const globalProblemSolutions = await prisma.globalProblemSolution.findMany({
            where: {
                globalProblemId: globalProblem.id
            }
        });
        for (let i = 0; i < globalProblemSolutions.length; i++) {
            for (let j = i + 1; j < globalProblemSolutions.length; j++) {
                pairs.push({
                    thisGlobalProblemSolution: globalProblemSolutions[i],
                    thatGlobalProblemSolution: globalProblemSolutions[j],
                    globalProblem: globalProblem
                });
            }
        }
    }
    return pairs;
}


export async function aggregateGlobalProblemSolutionPairAllocations() {
    const allocations = await prisma.globalProblemSolutionPairAllocation.findMany();
    const problemAllocations: Record<string, number> = {};
    // Sum up the percentages for each problem
    for (const allocation of allocations) {
        const { thisGlobalProblemSolutionId, thatGlobalProblemSolutionId, thisGlobalProblemSolutionPercentage } = allocation;

        problemAllocations[thisGlobalProblemSolutionId] = (problemAllocations[thisGlobalProblemSolutionId] || 0) + thisGlobalProblemSolutionPercentage;
        problemAllocations[thatGlobalProblemSolutionId] = (problemAllocations[thatGlobalProblemSolutionId] || 0) + (100 - thisGlobalProblemSolutionPercentage);
    }

    const totalAllocations = Object.values(problemAllocations).reduce((sum, allocation) => sum + allocation, 0);

    // Normalize the allocations to ensure they add up to 100%
    const normalizedAllocations: Record<string, number> = {};
    for (const problemId in problemAllocations) {
        normalizedAllocations[problemId] = (problemAllocations[problemId] / totalAllocations) * 100;
    }
    const results = [];
    for (const problemId in normalizedAllocations) {
        const result = await prisma.globalProblemSolution.update({
            where: { id: problemId },
            data: { averageAllocation: normalizedAllocations[problemId] },
        });
        results.push(result);
    }
    return results;
}

async function getGlobalProblemSolutionPairAllocationIdsForUserAndGlobalProblem(
    userId: string, globalProblemId: string) {
    const globalProblemSolutionIdsForGlobalProblem =
        await getGlobalProblemSolutionIdsForGlobalProblem(globalProblemId);
    return prisma.globalProblemSolutionPairAllocation.findMany({
        where: {
            userId: userId,
            thisGlobalProblemSolutionId: {
                in: globalProblemSolutionIdsForGlobalProblem.map(globalProblemSolution => globalProblemSolution.id)
            }
        },
        select: {
            id: true
        }
    });
}

async function getGlobalProblemSolutionIdsForGlobalProblem(globalProblemId: string) {
    return prisma.globalProblemSolution.findMany({
        where: {
            globalProblemId: globalProblemId
        },
        select: {
            id: true
        }
    });
}