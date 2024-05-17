import {WishingWell, PrismaClient} from "@prisma/client";
import {convertKeysToCamelCase, toTitleCase} from "@/lib/stringHelpers";
const prisma = new PrismaClient();

export async function getRandomWishingWellPair(userId: string | undefined) {
    let randomPair: WishingWell[] = [];
    if (userId) {
        randomPair = await prisma.$queryRaw`
          SELECT *
          FROM "wishing_wells"
          WHERE id NOT IN (
            SELECT "this_wishing_well_id" FROM "wishing_well_pair_allocations" WHERE "user_id" = ${userId}
            UNION
            SELECT "that_wishing_well_id" FROM "wishing_well_pair_allocations" WHERE "user_id" = ${userId}
          )
          ORDER BY random()
          LIMIT 2;
        `;
    } else {
        randomPair = await prisma.$queryRaw`
          SELECT *
          FROM "wishing_wells"
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

export async function getAllRandomWishingWellPairs() {
    let randomPairs: WishingWell[][] = [];
    const wishingWells = await prisma.wishingWell.findMany();
    for (let i = 0; i < wishingWells.length; i += 2) {
        randomPairs.push([wishingWells[i], wishingWells[i + 1]]);
    }
    return randomPairs;
}

export async function aggregateWishingWellPairAllocations() {
    const allocations = await prisma.wishingWellPairAllocation.findMany();
    const problemAllocations: Record<string, number> = {};
    // Sum up the percentages for each problem
    for (const allocation of allocations) {
        const { thisWishingWellId, thatWishingWellId, thisWishingWellPercentage } = allocation;

        problemAllocations[thisWishingWellId] = (problemAllocations[thisWishingWellId] || 0) + thisWishingWellPercentage;
        problemAllocations[thatWishingWellId] = (problemAllocations[thatWishingWellId] || 0) + (100 - thisWishingWellPercentage);
    }

    const totalAllocations = Object.values(problemAllocations).reduce((sum, allocation) => sum + allocation, 0);

    // Normalize the allocations to ensure they add up to 100%
    const normalizedAllocations: Record<string, number> = {};
    for (const problemId in problemAllocations) {
        normalizedAllocations[problemId] = (problemAllocations[problemId] / totalAllocations) * 100;
    }
    const results = [];
    for (const problemId in normalizedAllocations) {
        const result = await prisma.wishingWell.update({
            where: { id: problemId },
            data: { averageAllocation: normalizedAllocations[problemId] },
        });
        results.push(result);
    }
    return results;
}