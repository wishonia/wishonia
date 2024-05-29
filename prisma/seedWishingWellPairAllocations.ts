import {PrismaClient, User} from "@prisma/client";
import {
    createMinimalWishingWellPairs,
} from "@/lib/wishingWells";
import { prisma } from "@/lib/db";

export async function seedWishingWellPairAllocations(testUser: User) {
    const pairs = await createMinimalWishingWellPairs(testUser.id);
    console.log("Generating "+pairs.length+" wishing well pairs...");
    let counter = 0;
    let idsWithPair: string[] = [];
    for (const pair of pairs) {
        if(idsWithPair.includes(pair[0].id) || idsWithPair.includes(pair[1].id)) {continue;}
        const result = await prisma.wishingWellPairAllocation.create({
            data: {
                thisWishingWellId: pair[0].id,
                thatWishingWellId: pair[1].id,
                userId: testUser.id,
                thisWishingWellPercentage: 50,
            },
        });
        idsWithPair.push(pair[0].id);
        idsWithPair.push(pair[1].id);
        counter++;
        if (counter % 100 === 0) {
            let percentCompletion = (counter / pairs.length) * 100;
            percentCompletion = Math.round(percentCompletion * 100) / 100;
            console.log(`${percentCompletion}% of ${pairs.length} wishing well pairs created.`);
        }
    }
}
