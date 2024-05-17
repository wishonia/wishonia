import {getUserId} from "@/lib/api/getUserId";
import { PrismaClient, WishingWell } from '@prisma/client';
import {convertKeysToCamelCase} from "@/lib/stringHelpers";
const prisma = new PrismaClient();
export async function GET() {
    try {
        const userId = await getUserId();
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
        // Use the helper function to convert keys to camelCase
        randomPair = randomPair.map(convertKeysToCamelCase);

        return new Response(JSON.stringify({
          thisWishingWell: randomPair[0],
          thatWishingWell: randomPair[1],
        }))
    } catch (error) {
        return new Response(null, { status: 500 })
    }
}