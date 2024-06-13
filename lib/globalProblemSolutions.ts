import {GlobalProblem, GlobalProblemSolution, GlobalProblemSolutionPairAllocation} from "@prisma/client";
import {prisma} from "@/lib/db";

async function getRandomGlobalProblemSolutionsForUser(globalProblemId: string,
                                                      userId: string): Promise<{ id: string }[]> {
    const existingAllocations = await prisma.globalProblemSolutionPairAllocation.findMany({
        where: {
            globalProblemId: globalProblemId,
            userId: userId
        },
        select: {
            thisGlobalProblemSolutionId: true,
            thatGlobalProblemSolutionId: true
        }
    });
    return prisma.globalProblemSolution.findMany({
        where: {
            globalProblemId: globalProblemId,
            id: {
                notIn: existingAllocations.map(allocation =>
                    allocation.thisGlobalProblemSolutionId)
            }
        },
        orderBy: {
            id: 'asc'
        },
        take: 2
    });
}

async function getRandomGlobalProblemSolutionsAnonymous(globalProblemId: string): Promise<{ id: string }[]> {
    return prisma.$queryRaw`
        SELECT id
        FROM "GlobalProblemSolution"
        WHERE "globalProblemId" = ${globalProblemId}
        ORDER BY random()
        LIMIT 2;
    `;
}

function createWhereClause(ids: { id: string }[]) {
    const where = [];
    for (let i = 0; i < ids.length; i++) {
        where.push(ids[i].id);
    }
    return where;
}

export async function getRandomGlobalProblemSolutionPair(globalProblemId: string, userId: string | undefined) {
    let ids: { id: string }[];
    if (userId) {
        ids = await getRandomGlobalProblemSolutionsForUser(globalProblemId, userId);
    } else {
        ids = await getRandomGlobalProblemSolutionsAnonymous(globalProblemId);
    }
    const where = createWhereClause(ids);
    return prisma.globalProblemSolution.findMany({
        where: {
            id: {
                in: where
            }
        }
    });
}

export async function getAllRandomGlobalProblemSolutionPairs() {
    const globalProblems = await prisma.globalProblem.findMany();
    const pairs: {
        thisGlobalProblemSolution: GlobalProblemSolution,
        thatGlobalProblemSolution: GlobalProblemSolution,
        globalProblem: GlobalProblem
    }[] = [];
    // Loop through all global problems and get random pairs of global problem solutions
    for (const globalProblem of globalProblems) {
        const globalProblemSolutions = await prisma.globalProblemSolution.findMany({
            where: {
                globalProblemId: globalProblem.id
            }
        });
        for (let i = 0; i < globalProblemSolutions.length; i++) {
            for (let j = i + 1; j < globalProblemSolutions.length; j++) {
                pairs.push({
                    thisGlobalProblemSolution: globalProblemSolutions[i],
                    thatGlobalProblemSolution: globalProblemSolutions[j],
                    globalProblem: globalProblem
                });
            }
        }
    }
    return pairs;
}


async function fetchGlobalProblemsWithSolutions() {
    return prisma.globalProblem.findMany({
        include: {
            globalProblemSolutions: true
        }
    });
}

async function getGlobalProblemSolutionPairAllocations(globalProblemId: string) {
    return prisma.globalProblemSolutionPairAllocation.findMany({
        where: {
            globalProblemId: globalProblemId
        }
    });
}

function generateAllocationsArrayById(globalProblemSolutionAllocations: GlobalProblemSolutionPairAllocation[]) {
    const allocationsToEachGlobalProblemSolution: Record<string, number[]> = {};
    for (const allocation of globalProblemSolutionAllocations) {
        const {thisGlobalProblemSolutionId, thisGlobalProblemSolutionPercentage} =
            allocation;
        allocationsToEachGlobalProblemSolution[thisGlobalProblemSolutionId] =
            (allocationsToEachGlobalProblemSolution[thisGlobalProblemSolutionId] || [])
                .concat(thisGlobalProblemSolutionPercentage);
        if (!allocationsToEachGlobalProblemSolution[allocation.thatGlobalProblemSolutionId]) {
            allocationsToEachGlobalProblemSolution[allocation.thatGlobalProblemSolutionId] = [];
        }
        allocationsToEachGlobalProblemSolution[allocation.thatGlobalProblemSolutionId]
            .push(100 - thisGlobalProblemSolutionPercentage);
    }
    return allocationsToEachGlobalProblemSolution;
}

function generateAverageAllocations(globalProblemSolutions: GlobalProblemSolution[],
                                    allocationsToEachGlobalProblemSolution: Record<string, number[]>) {
    const averageAllocationsToEachGlobalProblemSolution: Record<string, number> = {};
    for (const globalProblemSolution of globalProblemSolutions) {
        const allocations = allocationsToEachGlobalProblemSolution[globalProblemSolution.id] || [];
        const length = allocations.length;
        if (length === 0) {
            console.log(`No allocations found for global problem solution: ${globalProblemSolution.name}`);
            continue;
        }
        const sum = allocations.reduce((sum, allocation) => sum + allocation, 0);
        if (isNaN(sum)) {
            throw new Error(`Invalid sum: ${sum}`);
        }
        averageAllocationsToEachGlobalProblemSolution[globalProblemSolution.id] = sum / length;
    }
    return averageAllocationsToEachGlobalProblemSolution;
}

function generateNormalizedAllocations(averageAllocationsToEachGlobalProblemSolution: Record<string, number>) {
    const normalizedAllocationToEachGlobalProblemSolution: Record<string, number> = {};
    let total = 0;
    for (const globalProblemSolutionId in averageAllocationsToEachGlobalProblemSolution) {
        const value = averageAllocationsToEachGlobalProblemSolution[globalProblemSolutionId];
        // make sure the value is a number between 0 and 100
        if (isNaN(value) || value < 0 || value > 100) {
            throw new Error(`Invalid average allocation value: ${value}`);
        }
        total += value;
    }
    for (const globalProblemSolutionId in averageAllocationsToEachGlobalProblemSolution) {
        normalizedAllocationToEachGlobalProblemSolution[globalProblemSolutionId] =
            (averageAllocationsToEachGlobalProblemSolution[globalProblemSolutionId] / total) * 100;
    }
    return normalizedAllocationToEachGlobalProblemSolution;
}

export async function aggregateGlobalProblemSolutionPairAllocationsForProblem(globalProblemId: string) {
    const globalProblemSolutions =
        await prisma.globalProblemSolution.findMany({
        where: {globalProblemId: globalProblemId}
    });
    const globalProblemSolutionAllocations =
        await getGlobalProblemSolutionPairAllocations(globalProblemId);
    const allocationsToEachGlobalProblemSolution =
        generateAllocationsArrayById(globalProblemSolutionAllocations);
    const averageAllocationsToEachGlobalProblemSolution =
        generateAverageAllocations(globalProblemSolutions, allocationsToEachGlobalProblemSolution);
    const normalizedAllocationToEachGlobalProblemSolution =
        generateNormalizedAllocations(averageAllocationsToEachGlobalProblemSolution);
    for (const globalProblemSolution of globalProblemSolutions) {
        const averageAllocation = normalizedAllocationToEachGlobalProblemSolution[globalProblemSolution.id];
        await prisma.globalProblemSolution.update({
            where: {id: globalProblemSolution.id},
            data: {averageAllocation: averageAllocation}
        });
    }
}

export async function aggregateGlobalProblemSolutionPairAllocations() {
    const globalProblemIds = await prisma.globalProblem.findMany({
        select: {id: true}
    });
    for (const globalProblemId of globalProblemIds) {
        await aggregateGlobalProblemSolutionPairAllocationsForProblem(globalProblemId.id);
    }
}

export async function updateOrCreateGlobalProblemSolutionPairAllocation(
    thisGlobalProblemSolutionId: string,
    thatGlobalProblemSolutionId: string,
    thisGlobalProblemSolutionPercentage: number,
    userId: string
) {
    const thisGlobalProblemSolution = await prisma.globalProblemSolution.findUnique({
        where: {id: thisGlobalProblemSolutionId}
    });
    const thatGlobalProblemSolution = await prisma.globalProblemSolution.findUnique({
        where: {id: thatGlobalProblemSolutionId}
    });

    if (!thisGlobalProblemSolution || !thatGlobalProblemSolution) {
        throw new Error("Invalid global problem solution id");
    }
    if(thisGlobalProblemSolutionPercentage < 0 || thisGlobalProblemSolutionPercentage > 100) {
        throw new Error("Invalid percentage");
    }
    if(thisGlobalProblemSolution.globalProblemId !== thatGlobalProblemSolution.globalProblemId) {
        throw new Error("Global problem solutions must belong to the same global problem");
    }
    const globalProblemId = thisGlobalProblemSolution.globalProblemId;
    const existingAllocation = await prisma.globalProblemSolutionPairAllocation.findFirst({
        where: {
            globalProblemId: globalProblemId,
            thisGlobalProblemSolutionId: thisGlobalProblemSolutionId,
            thatGlobalProblemSolutionId: thatGlobalProblemSolutionId,
            userId: userId
        }
    });
    if (existingAllocation) {
        return prisma.globalProblemSolutionPairAllocation.update({
            where: {id: existingAllocation.id},
            data: {thisGlobalProblemSolutionPercentage}
        });
    }
    return prisma.globalProblemSolutionPairAllocation.create({
        data: {
            globalProblemId,
            thisGlobalProblemSolutionId,
            thatGlobalProblemSolutionId,
            thisGlobalProblemSolutionPercentage,
            userId
        }
    });
}