import {GlobalSolution} from "@prisma/client";
import { prisma } from "@/lib/db";

async function getRandomGlobalSolutionsForUser(userId: string): Promise<{ id: string }[]> {
    return prisma.$queryRaw`
        SELECT id
        FROM "GlobalSolution"
        WHERE id NOT IN (SELECT "thisGlobalSolutionId"
                         FROM "GlobalSolutionPairAllocation"
                         WHERE "GlobalSolution"."userId" = ${userId}
                         UNION
                         SELECT "thatGlobalSolutionId"
                         FROM "GlobalSolutionPairAllocation"
                         WHERE "GlobalSolution"."userId" = ${userId})
        ORDER BY random()
        LIMIT 2;
    `;
}

async function getRandomGlobalSolutionsAnonymous(): Promise<{ id: string }[]> {
    return prisma.$queryRaw`
        SELECT id
        FROM "GlobalSolution"
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

export async function getRandomGlobalSolutionPair(userId: string | undefined) {
    let ids: { id: string }[] = [];
    if (userId) {
        ids = await getRandomGlobalSolutionsForUser(userId);
    } else {
        ids = await getRandomGlobalSolutionsAnonymous();
    }
    const where = createWhereClause(ids);
    return prisma.globalSolution.findMany({
        where: {
            id: {
                in: where
            }
        }
    });
}

export async function getAllRandomGlobalSolutionPairs() {
    let randomPairs: GlobalSolution[][] = [];
    const globalSolutions = await prisma.globalSolution.findMany();
    for (let i = 0; i < globalSolutions.length; i += 2) {
        randomPairs.push([globalSolutions[i], globalSolutions[i + 1]]);
    }
    return randomPairs;
}


export async function aggregateGlobalSolutionPairAllocations() {
    const allocations = await prisma.globalSolutionPairAllocation.findMany();
    const problemAllocations: Record<string, number> = {};
    // Sum up the percentages for each problem
    for (const allocation of allocations) {
        const { thisGlobalSolutionId, thatGlobalSolutionId, thisGlobalSolutionPercentage } = allocation;

        problemAllocations[thisGlobalSolutionId] = (problemAllocations[thisGlobalSolutionId] || 0) + thisGlobalSolutionPercentage;
        problemAllocations[thatGlobalSolutionId] = (problemAllocations[thatGlobalSolutionId] || 0) + (100 - thisGlobalSolutionPercentage);
    }

    const totalAllocations = Object.values(problemAllocations).reduce((sum, allocation) => sum + allocation, 0);

    // Normalize the allocations to ensure they add up to 100%
    const normalizedAllocations: Record<string, number> = {};
    for (const problemId in problemAllocations) {
        normalizedAllocations[problemId] = (problemAllocations[problemId] / totalAllocations) * 100;
    }
    const results = [];
    for (const problemId in normalizedAllocations) {
        const result = await prisma.globalSolution.update({
            where: { id: problemId },
            data: { averageAllocation: normalizedAllocations[problemId] },
        });
        results.push(result);
    }
    return results;
}