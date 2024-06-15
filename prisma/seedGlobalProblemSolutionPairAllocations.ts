import {User} from "@prisma/client";
import { prisma } from "@/lib/db";
import {
    aggregateGlobalProblemSolutionPairAllocations,
    getAllRandomGlobalProblemSolutionPairs
} from "@/lib/globalProblemSolutions";

export async function seedGlobalProblemSolutionPairAllocations(testUser: User) {
    const pairs = await getAllRandomGlobalProblemSolutionPairs();
    console.log(`Seeding GlobalProblem Solution Pair Allocations for ${pairs.length} pairs`);
    let count = 0;
    const existingAllocations = await prisma.globalProblemSolutionPairAllocation.findMany({
        where: {
            userId: testUser.id
        }
    });
    for (const pair of pairs) {
        count++;
        const existing = existingAllocations.find(allocation => {
            return allocation.thisGlobalProblemSolutionId === pair.thisGlobalProblemSolution.id &&
                allocation.thatGlobalProblemSolutionId === pair.thatGlobalProblemSolution.id;
        });
        if(existing) {
            console.log(`Already allocated ${pair.thisGlobalProblemSolution.name} and ${pair.thatGlobalProblemSolution.name}`);
            continue;
        }
        const result =
            await prisma.globalProblemSolutionPairAllocation.create({
            data: {
                thisGlobalProblemSolutionId: pair.thisGlobalProblemSolution.id,
                thatGlobalProblemSolutionId: pair.thatGlobalProblemSolution.id,
                userId: testUser.id,
                thisGlobalProblemSolutionPercentage: 50,
                globalProblemId: pair.globalProblem.id
            },
        });
        console.log(`${count} / ${pairs.length} pairs allocated`);
    }
    await aggregateGlobalProblemSolutionPairAllocations();
}
