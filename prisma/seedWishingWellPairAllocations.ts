import {PrismaClient, User} from "@prisma/client";
import {getAllRandomWishingWellPairs} from "@/lib/wishingWells";
const prisma = new PrismaClient();

export async function seedWishingWellPairAllocations(testUser: User) {
    const pairs = await getAllRandomWishingWellPairs();
    for (const pair of pairs) {
        const result = await prisma.wishingWellPairAllocation.create({
            data: {
                thisWishingWellId: pair[0].id,
                thatWishingWellId: pair[1].id,
                userId: testUser.id,
                thisWishingWellPercentage: 50,
            },
        });
        console.log("Problem pair allocation created result: ", result);
    }
}
