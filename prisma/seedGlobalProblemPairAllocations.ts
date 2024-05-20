import {PrismaClient, User} from "@prisma/client";
import {getAllRandomGlobalProblemPairs} from "@/lib/globalProblems";
const prisma = new PrismaClient();

export async function seedGlobalProblemPairAllocations(testUser: User) {
    const pairs = await getAllRandomGlobalProblemPairs();
    let idsWithPair: string[] = [];
    for (const pair of pairs) {
        if(idsWithPair.includes(pair[0].id) && idsWithPair.includes(pair[1].id)) {continue;}
        const result = await prisma.globalProblemPairAllocation.create({
            data: {
                thisGlobalProblemId: pair[0].id,
                thatGlobalProblemId: pair[1].id,
                userId: testUser.id,
                thisGlobalProblemPercentage: 50,
            },
        });
        idsWithPair.push(pair[0].id);
        idsWithPair.push(pair[1].id);
    }
}
