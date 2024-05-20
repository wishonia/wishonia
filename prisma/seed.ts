import {PrismaClient} from "@prisma/client";
import {seedGlobalProblems} from "@/prisma/seedGlobalProblems";
import {seedWishingWells} from "@/prisma/seedWishingWells";
import {seedUser} from "@/prisma/seedUser";
import {seedGlobalProblemPairAllocations} from "@/prisma/seedGlobalProblemPairAllocations";
import {aggregateGlobalProblemPairAllocations} from "@/lib/globalProblems";
import {seedWishingWellPairAllocations} from "@/prisma/seedWishingWellPairAllocations";
import {aggregateWishingWellPairAllocations} from "@/lib/wishingWells";
const prisma = new PrismaClient();

async function main() {
    const testUser = await seedUser();
    await seedGlobalProblems(testUser);
    await seedWishingWells(testUser);
    await seedGlobalProblemPairAllocations(testUser);
    await aggregateGlobalProblemPairAllocations();
    await seedWishingWellPairAllocations(testUser);
    await aggregateWishingWellPairAllocations();
}

main()
    .catch((e) => {
        debugger
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });