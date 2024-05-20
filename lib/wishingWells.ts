import {PrismaClient, WishingWell} from "@prisma/client";
import {convertKeysToCamelCase, toTitleCase} from "@/lib/stringHelpers";
import {db} from "@/lib/db";
import {wishToWishingWell} from "@/scripts/wishingWellGenerator";
import {put} from "@vercel/blob";

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

export async function generateAllWishingWellPairs() {
    let combinations: WishingWell[][] = [];
    function generateCombinations(wishingWells: WishingWell[], currentCombination: WishingWell[] = []) {
        if (wishingWells.length === 0) {
            combinations.push(currentCombination);
        } else {
            for (let i = 0; i < wishingWells.length; i++) {
                let newCombination = currentCombination.concat(wishingWells[i]);
                let remainingWishingWells = wishingWells.slice(0, i).concat(wishingWells.slice(i + 1));
                generateCombinations(remainingWishingWells, newCombination);
            }
        }
    }
    const wishingWells = await prisma.wishingWell.findMany();
    generateCombinations(wishingWells);
    return combinations;
}

export async function aggregateWishingWellPairAllocations() {
    const allocations = await prisma.wishingWellPairAllocation.findMany();
    const allocationsByWishingWellId: Record<string, number> = {};
    // Sum up the percentages for each problem
    for (const allocation of allocations) {
        const { thisWishingWellId, thatWishingWellId, thisWishingWellPercentage } = allocation;

        allocationsByWishingWellId[thisWishingWellId] = (allocationsByWishingWellId[thisWishingWellId] || 0) + thisWishingWellPercentage;
        allocationsByWishingWellId[thatWishingWellId] = (allocationsByWishingWellId[thatWishingWellId] || 0) + (100 - thisWishingWellPercentage);
    }

    const totalAllocations = Object.values(allocationsByWishingWellId).reduce((sum, allocation) => sum + allocation, 0);

    // Normalize the allocations to ensure they add up to 100%
    const normalizedAllocations: Record<string, number> = {};
    for (const problemId in allocationsByWishingWellId) {
        normalizedAllocations[problemId] = (allocationsByWishingWellId[problemId] / totalAllocations) * 100;
    }
    const results = [];
    for (const wishingWellId in normalizedAllocations) {
        const result = await prisma.wishingWell.update({
            where: { id: wishingWellId },
            data: { averageAllocation: normalizedAllocations[wishingWellId] },
        });
        results.push(result);
    }
    return results;
}

export async function uploadImageToVercel(buffer: Buffer, fileName: string) {
    const blob = await put(fileName, buffer, {
        access: 'public',
    });
    return blob.url;
}

export async function saveWishToWishingWell(wish: string, userId: string) {
    const obj = await wishToWishingWell(wish);
    obj.userId = userId;

    // Check if a wishingWell with the same name already exists
    const existingWishingWell = await db.wishingWell.findFirst({
        where: {
            name: obj.name,
        },
        select: {
            id: true,
            name: true,
            description: true,
        },
    });

    // If it exists, return it
    if (existingWishingWell) {
        return existingWishingWell;
    }

    // If it doesn't exist, create a new one
    return db.wishingWell.create({
        data: obj,
        select: {
            id: true,
            name: true,
            description: true,
        },
    });
}
