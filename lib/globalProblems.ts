import {GlobalProblem, PrismaClient} from "@prisma/client";
import {convertKeysToCamelCase, toTitleCase} from "@/lib/stringHelpers";
const prisma = new PrismaClient();

export async function getRandomGlobalProblemPair(userId: string | undefined) {
    let randomPair: GlobalProblem[] = [];
    if (userId) {
        randomPair = await prisma.$queryRaw`
          SELECT *
          FROM "global_problems"
          WHERE id NOT IN (
            SELECT "this_global_problem_id" FROM "global_problem_pair_allocations" WHERE "user_id" = ${userId}
            UNION
            SELECT "that_global_problem_id" FROM "global_problem_pair_allocations" WHERE "user_id" = ${userId}
          )
          ORDER BY random()
          LIMIT 2;
        `;
    } else {
        randomPair = await prisma.$queryRaw`
          SELECT *
          FROM "global_problems"
          ORDER BY random()
          LIMIT 2;
        `;
    }
    randomPair = randomPair.map(convertKeysToCamelCase);
    for (const problem of randomPair) {
        problem.name = toTitleCase(problem.name)
    }
    return randomPair;
}

export async function getAllRandomGlobalProblemPairs() {
    let randomPairs: GlobalProblem[][] = [];
    const globalProblems = await prisma.globalProblem.findMany();
    for (let i = 0; i < globalProblems.length; i += 2) {
        randomPairs.push([globalProblems[i], globalProblems[i + 1]]);
    }
    return randomPairs;
}


export async function aggregateGlobalProblemPairAllocations() {
    const allocations = await prisma.globalProblemPairAllocation.findMany();
    const problemAllocations: Record<string, number> = {};
    // Sum up the percentages for each problem
    for (const allocation of allocations) {
        const { thisGlobalProblemId, thatGlobalProblemId, thisGlobalProblemPercentage } = allocation;

        problemAllocations[thisGlobalProblemId] = (problemAllocations[thisGlobalProblemId] || 0) + thisGlobalProblemPercentage;
        problemAllocations[thatGlobalProblemId] = (problemAllocations[thatGlobalProblemId] || 0) + (100 - thisGlobalProblemPercentage);
    }

    const totalAllocations = Object.values(problemAllocations).reduce((sum, allocation) => sum + allocation, 0);

    // Normalize the allocations to ensure they add up to 100%
    const normalizedAllocations: Record<string, number> = {};
    for (const problemId in problemAllocations) {
        normalizedAllocations[problemId] = (problemAllocations[problemId] / totalAllocations) * 100;
    }
    const results = [];
    for (const problemId in normalizedAllocations) {
        const result = await prisma.globalProblem.update({
            where: { id: problemId },
            data: { averageAllocation: normalizedAllocations[problemId] },
        });
        results.push(result);
    }
    return results;
}