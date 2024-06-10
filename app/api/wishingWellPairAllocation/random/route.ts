import {getUserId} from "@/lib/api/getUserId";
import { WishingWell } from '@prisma/client';
import {convertKeysToCamelCase} from "@/lib/stringHelpers";
import { prisma } from "@/lib/db";
import {handleError} from "@/lib/errorHandler";
export async function GET() {
    try {
        const userId = await getUserId();
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
          FROM "WishingWell"
          ORDER BY random()
          LIMIT 2;
        `;
        }
        // Use the helper function to convert keys to camelCase
        randomPair = randomPair.map(convertKeysToCamelCase);

        return new Response(JSON.stringify({
          thisWishingWell: randomPair[0],
          thatWishingWell: randomPair[1],
        }))
    } catch (error) {
        return handleError(error)
    }
}