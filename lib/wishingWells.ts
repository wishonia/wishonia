import {WishingWell} from "@prisma/client";
import {convertKeysToCamelCase, toTitleCase} from "@/lib/stringHelpers";
import {prisma as db} from "@/lib/db";
import {put} from "@vercel/blob";
import {textCompletion} from "@/lib/llm";

import { prisma } from "@/lib/db";

export async function getRandomWishingWellPair(userId: string | undefined) {
    let randomPair: WishingWell[] = [];
    if (userId) {
        randomPair = await prisma.$queryRaw`
          SELECT *
          FROM "WishingWell"
          WHERE id NOT IN (
            SELECT "thisWishingWellId" FROM "WishingWellPairAllocation" WHERE "userId" = ${userId}
            UNION
            SELECT "thatWishingWellId" FROM "WishingWellPairAllocation" WHERE "userId" = ${userId}
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

export async function wishToWishingWell(wish: string) {
    const str = await textCompletion(
        `Return a json object with the following properties of an article on this wish: 
      
      ${wish}
      
      Here are the Properties of the object you should return:
      1. "name": a generalized name for the wish of the under 64 characters long. Make it generalized and as short as possible so we can avoid duplicate wish entries.  Should not include the word Wish.
      2. "description": a meta description for the article under 240 characters long`,
        "json_object");
    let obj = JSON.parse(str);
    //obj.content = textCompletion(generateArticlePrompt(wish), "text");
    //await generateAndUploadImageToVercel(obj);
    return obj;
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
export async function createMinimalWishingWellPairs(testUserId: string) {
    const wishingWells: WishingWell[] = await prisma.wishingWell.findMany();
    const pairs: [WishingWell, WishingWell][] = [];

    for (let i = 0; i < wishingWells.length; i++) {
        const thisWishingWell = wishingWells[i];
        const thatWishingWell = i + 1 < wishingWells.length ? wishingWells[i + 1] : wishingWells[0];

        pairs.push([thisWishingWell, thatWishingWell]);

        await prisma.wishingWellPairAllocation.create({
            data: {
                thisWishingWellId: thisWishingWell.id,
                thatWishingWellId: thatWishingWell.id,
                thisWishingWellPercentage: 50,
                userId: testUserId
            },
        });
    }

    return pairs;
}