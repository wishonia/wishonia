import slugify from 'slugify';
import path from 'path';
import { jsonArrayCompletion, textCompletion } from "@/lib/llm";
import { generateAndSaveFeaturedImageJpg } from "@/lib/imageGenerator";
import { prisma } from "@/lib/db";

const publicPath = 'globalSolutions';

export async function generateGlobalSolutions() {
    // Fetch all GlobalProblems
    const globalProblems = await prisma.globalProblem.findMany();

    // Loop through each GlobalProblem
    for (const globalProblem of globalProblems) {
        // Use textCompletion to ask the LLM to provide an array of the most promising actionable solutions for the given global problem
        const solutions = await jsonArrayCompletion(
            `5 concrete actionable solutions to solve the problem of "${globalProblem.name}"`
        );

        // Loop through each solution
        for (const solutionName of solutions) {
            // Check if the solution already exists in the database
            const existingSolution = await prisma.globalSolution.findUnique({
                where: {
                    name: solutionName
                }
            });

            if (existingSolution) {
                console.log(`Solution "${solutionName}" already exists in the database.`);
                continue;
            }

            const imagePath = path.join(
                __dirname,
                '..',
                'public',
                publicPath,
                `${slugify(solutionName, { lower: true, strict: true })}.jpg`
            );

            // Have the LLM generate the content, description, and featured image for the solution
            const content = await textCompletion(
                `Given the global problem "${globalProblem.name}", provide a detailed content for the solution "${solutionName}".`,
                'text'
            );
            const description = await textCompletion(
                `provide a brief description for the solution "${solutionName}".`,
                'text'
            );
            const featuredImage = await generateAndSaveFeaturedImageJpg(solutionName, imagePath);

            // Insert the solution into the database
            await prisma.globalSolution.create({
                data: {
                    name: solutionName,
                    description: description,
                    content: content,
                    featuredImage: featuredImage,
                    globalProblem: {
                        connect: {
                            id: globalProblem.id
                        }
                    }
                }
            });
        }
    }
}