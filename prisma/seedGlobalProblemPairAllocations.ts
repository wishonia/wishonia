import {PrismaClient, User} from "@prisma/client";
import {getAllRandomGlobalProblemPairs} from "@/lib/globalProblems";
const prisma = new PrismaClient();

export async function seedGlobalProblemPairAllocations(testUser: User) {
    const pairs = await getAllRandomGlobalProblemPairs();
    for (const pair of pairs) {
        const result = await prisma.globalProblemPairAllocation.create({
            data: {
                thisGlobalProblemId: pair[0].id,
                thatGlobalProblemId: pair[1].id,
                userId: testUser.id,
                thisGlobalProblemPercentage: 50,
            },
        });
        console.log("Problem pair allocation created result: ", result);
    }
}
