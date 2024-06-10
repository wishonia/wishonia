import {textCompletion} from "@/lib/llm";
import { prisma } from "@/lib/db";
import {GlobalProblem, GlobalSolution} from "@prisma/client";
import {sharedSolutionPromptText} from "@/lib/globalSolutionsGenerator";
import {generateAndUploadFeaturedImageJpg} from "@/lib/imageGenerator";

const generateImages = false;
export async function linkGlobalProblemSolution(globalProblem: GlobalProblem,
                                         globalSolution: GlobalSolution) {
    const description = await textCompletion(
        `Write a brief description of how the solution "${globalSolution.name}" addresses the global problem "${globalProblem.name}".`,
        'text');
    const content = await generateProblemSolutionContent(globalProblem, globalSolution);
    let featuredImage = globalSolution.featuredImage;
    if(!featuredImage && generateImages) {
        featuredImage = await generateAndUploadFeaturedImageJpg(
            `How ${globalSolution.name} Solves ${globalProblem.name}`,
            `global-problem-solutions/${globalProblem.id}-${globalSolution.id}.jpg`);
    }
    return prisma.globalProblemSolution.create({
        data: {
            globalProblemId: globalProblem.id,
            globalSolutionId: globalSolution.id,
            name: `How ${globalSolution.name} Solves ${globalProblem.name}`,
            description: description,
            content: content,
            featuredImage: featuredImage,
        }
    });
}

async function generateProblemSolutionContent(globalProblem: GlobalProblem, globalSolution: GlobalSolution) {
    return await textCompletion(
        `Write a comprehensive article about how the solution "${globalSolution.name}" addresses the global problem "${globalProblem.name}".
        
        ${sharedSolutionPromptText}
        `,
        'text');
}

export async function generateGlobalProblemSolutions() {
    const globalProblems = await prisma.globalProblem.findMany();
    const globalSolutions = await prisma.globalSolution.findMany();
    for (const globalProblem of globalProblems) {
        for (const globalSolution of globalSolutions) {
            const prompt = `Is the solution "${globalSolution.name}"
            a good solution for the global problem "${globalProblem.name}"?
            Please only respond with the word YES or the word NO.
            `;
            const isGoodSolution = await textCompletion(prompt,
                'text');
            if(isGoodSolution === 'YES'){
                await linkGlobalProblemSolution(globalProblem, globalSolution);
            }
        }
    }
}

