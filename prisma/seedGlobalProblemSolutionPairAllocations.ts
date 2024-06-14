import {User} from "@prisma/client";
import { prisma } from "@/lib/db";
import {getAllRandomGlobalProblemSolutionPairs} from "@/lib/globalProblemSolutions";

export async function seedGlobalProblemSolutionPairAllocations(testUser: User) {
    const pairs = await getAllRandomGlobalProblemSolutionPairs();
    for (const pair of pairs) {
        const existing = await prisma.globalProblemSolutionPairAllocation.findFirst({
            where: {
                thisGlobalProblemSolutionId: pair.thisGlobalProblemSolution.id,
                thatGlobalProblemSolutionId: pair.thatGlobalProblemSolution.id,
                userId: testUser.id
            }
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
    }
}
