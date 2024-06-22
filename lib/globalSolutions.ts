import {GlobalSolution} from "@prisma/client";
import {prisma} from "@/lib/db";
import {askYesOrNoQuestion} from "@/lib/llm";
import fs from "fs";
import {absPathFromRepo} from "@/lib/fileHelper";
import {createSlug} from "@/lib/stringHelper";

async function getRandomGlobalSolutionsForUser(userId: string): Promise<{ id: string }[]> {
    return prisma.$queryRaw`
        SELECT id
        FROM "GlobalSolution"
        WHERE id NOT IN (SELECT "thisGlobalSolutionId"
                         FROM "GlobalSolutionPairAllocation"
                         WHERE "GlobalSolution"."userId" = ${userId}
                         UNION
                         SELECT "thatGlobalSolutionId"
                         FROM "GlobalSolutionPairAllocation"
                         WHERE "GlobalSolution"."userId" = ${userId})
        ORDER BY random()
        LIMIT 2;
    `;
}

async function getRandomGlobalSolutionsAnonymous(): Promise<{ id: string }[]> {
    return prisma.$queryRaw`
        SELECT id
        FROM "GlobalSolution"
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

export async function getRandomGlobalSolutionPair(userId: string | undefined) {
    let ids: { id: string }[] = [];
    if (userId) {
        ids = await getRandomGlobalSolutionsForUser(userId);
    } else {
        ids = await getRandomGlobalSolutionsAnonymous();
    }
    const where = createWhereClause(ids);
    return prisma.globalSolution.findMany({
        where: {
            id: {
                in: where
            }
        }
    });
}

export async function getAllRandomGlobalSolutionPairs() {
    let randomPairs: GlobalSolution[][] = [];
    const globalSolutions = await prisma.globalSolution.findMany();
    for (let i = 0; i < globalSolutions.length; i += 2) {
        randomPairs.push([globalSolutions[i], globalSolutions[i + 1]]);
    }
    return randomPairs;
}


export async function aggregateGlobalSolutionPairAllocations() {
    const allocations = await prisma.globalSolutionPairAllocation.findMany();
    const solutionAllocations: Record<string, number> = {};
    // Sum up the percentages for each solution
    for (const allocation of allocations) {
        const { thisGlobalSolutionId, thatGlobalSolutionId, thisGlobalSolutionPercentage } = allocation;

        solutionAllocations[thisGlobalSolutionId] = (solutionAllocations[thisGlobalSolutionId] || 0) + thisGlobalSolutionPercentage;
        solutionAllocations[thatGlobalSolutionId] = (solutionAllocations[thatGlobalSolutionId] || 0) + (100 - thisGlobalSolutionPercentage);
    }

    const totalAllocations = Object.values(solutionAllocations)
        .reduce((sum, allocation) => sum + allocation, 0);

    // Normalize the allocations to ensure they add up to 100%
    const normalizedAllocations: Record<string, number> = {};
    for (const globalSolutionId in solutionAllocations) {
        normalizedAllocations[globalSolutionId] = (solutionAllocations[globalSolutionId] / totalAllocations) * 100;
    }
    const results = [];
    for (const globalSolutionId in normalizedAllocations) {
        const result = await prisma.globalSolution.update({
            where: { id: globalSolutionId },
            data: { averageAllocation: normalizedAllocations[globalSolutionId] },
        });
        results.push(result);
    }
    return results;
}

export async function isGoodSolution(problemName: string, solutionName: string) {
    return await askYesOrNoQuestion(`
Is "${solutionName}" something you'd expect to see on a website that lists potential 
global solutions to the problem of ${problemName}?`);
}

export async function dumpGlobalSolutionNames(){
    const solutionsByProblemId: { [key: string]: string[] } = {};
    const globalProblems = await prisma.globalProblem.findMany();
    for (const globalProblem of globalProblems) {
        console.log(`Global Problem: ${globalProblem.name}`);
        const globalProblemSolutions = await prisma.globalProblemSolution.findMany({
            where: {
                globalProblemId: globalProblem.id
            }
        });
        for (const globalProblemSolution of globalProblemSolutions) {
            const globalSolution = await prisma.globalSolution.findFirst({
                where: {
                    id: globalProblemSolution.globalSolutionId
                }
            });
            if (!globalSolution) throw new Error("Global Solution not found");
            if(!solutionsByProblemId[globalProblem.name]){
                solutionsByProblemId[globalProblem.name] = [];
            }
            solutionsByProblemId[globalProblem.name].push(globalSolution.name);
        }
    }
    fs.writeFileSync(absPathFromRepo(
            'prisma/seeds/globalSolutionNames.json'),
        JSON.stringify(solutionsByProblemId, null, 2));
}

export async function updateOrCreateGlobalSolutionPairAllocation(thisGlobalSolutionId: string,
                                                              thatGlobalSolutionId: string,
                                                              thisGlobalSolutionPercentage: number,
                                                              userId: string) {
    const result = await prisma.globalSolutionPairAllocation.upsert({
        where: {
            userId_thisGlobalSolutionId_thatGlobalSolutionId: {
                userId: userId,
                thisGlobalSolutionId: thisGlobalSolutionId,
                thatGlobalSolutionId: thatGlobalSolutionId,
            },
        },
        update: {
            thisGlobalSolutionPercentage,
        },
        create: {
            thisGlobalSolutionId,
            thatGlobalSolutionId,
            thisGlobalSolutionPercentage,
            userId,
        },
    });
    await aggregateGlobalSolutionPairAllocations();
    return result;
}
export async function createGlobalSolution(name: string, description: string, content: string,
                                    featuredImage: string | undefined, userId: string) {
    return prisma.globalSolution.create({
        data: {
            id: createSlug(name),
            name,
            description,
            content,
            featuredImage,
            userId,
        }
    });
}

