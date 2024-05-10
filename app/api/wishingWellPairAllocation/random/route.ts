import {getUserId} from "@/lib/api/getUserId";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export async function GET() {
    try {
        const userId = await getUserId();

        let randomPair;

        if (userId) {
            randomPair = await prisma.$queryRaw`
          SELECT *
          FROM "wishing_wells"
          WHERE id NOT IN (
            SELECT "this_wishing_well_id" FROM "wishing_well_pair_allocations" WHERE wishing_well_pair_allocations."user_id" = ${userId}
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

        return new Response(JSON.stringify(randomPair))
    } catch (error) {
        return new Response(null, { status: 500 })
    }
}