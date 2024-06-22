import slugify from 'slugify';
import {formatTextResponse, jsonArrayCompletion, textCompletion} from "@/lib/llm";
import {generateAndUploadFeaturedImageJpg} from "@/lib/imageGenerator";
import {prisma} from "@/lib/db";
import {GlobalProblem, GlobalSolution} from "@prisma/client";
import {saveMarkdownPost} from "@/lib/markdownGenerator";
import {absPathFromPublic, absPathFromRepo} from "@/lib/fileHelper";
import fs from "fs";
import {createGlobalProblemSolution} from "@/lib/globalProblemSolutionGenerator";
import {createSlug} from "@/lib/stringHelper";
import {createGlobalSolution} from "@/lib/globalSolutions";
import {dumpTableToJson} from "@/lib/prisma/dumpDatabaseToJson";

const generateImages = false;
export async function generateGlobalSolutions() {
    const globalProblems = await prisma.globalProblem.findMany();
    let counter = 0;
    for (const globalProblem of globalProblems) {
        console.log(`Generating solutions for global problem: ${globalProblem.name}`)
        await generateGlobalProblemSolutionsForGlobalProblem(globalProblem);
        counter++;
        const percentCompleted = ((counter / globalProblems.length) * 100).toFixed(2);
        console.log(`Completed: ${counter}/${globalProblems.length} (${percentCompleted}%)`);
    }
}

export async function generateGlobalProblemSolutionsForGlobalProblem(globalProblem: GlobalProblem) {
    const existing = await prisma.globalProblemSolution.findMany({
        where: {
            globalProblemId: globalProblem.id
        }
    });
    if(existing.length > 5) {
        console.log(`Global problem ${globalProblem.name} already has solutions`);
        return;
    }
    const generatedSolutionNamesDescriptions =
        await generateSolutionNamesForGlobalProblem(globalProblem);
    for (const nameDescription of generatedSolutionNamesDescriptions) {
        console.log(`Generating solution: ${nameDescription.name} for problem: ${globalProblem.name}`);
        await createGlobalProblemSolution(nameDescription.name,
            nameDescription.description, globalProblem);
    }
}

export async function getOrCreateGlobalSolution(name: string, description: string, userId: string) {
    const existing = await prisma.globalSolution.findFirst({
        where: {
            name: name
        }
    });
    if(existing) {
        return existing;
    }
    return generateGlobalSolution(name, description, userId);
}


export async function generateGlobalSolution(name: string, description: string | null | undefined, userId: string) {
    if(!description) {
        description = await generateGlobalSolutionDescription(name);
    }
    const existing = await prisma.globalSolution.findFirst({
        where: {
            name: name
        }
    });
    if(existing) {
        return existing;
    }
    const slug = createSlug(name)
    const imagePath = `global-solutions/${slugify(slug)}.jpg`
    const mdPath = `global-solutions/${slug}.md`;
    const mdAbsPath = absPathFromPublic(mdPath);
    const content = await generateGlobalSolutionContent(name);
    let featuredImageUrl;
    if(generateImages) {
        featuredImageUrl =  await generateAndUploadFeaturedImageJpg(
            ` ${name} : ${description}`,
            imagePath);
    }
    const createdSolution =
        await createGlobalSolution(name, description, content, featuredImageUrl, userId);
    // Check if this is an API request or CLI script
    const isCli = typeof window === 'undefined'
    if(!isCli) {
        await saveMarkdownPost({
            name: name,
            description: description,
            content: content,
            featuredImage: featuredImageUrl,
            absFilePath: mdAbsPath,
            slug,
        })
    } else {
        console.log(`Generated global solution: ${name} with description: ${description}. Not saving markdown file.`);
    }
    return createdSolution;
}
export const sharedSolutionPromptText = `The article should cover the following aspects to help readers make informed decisions
 about funding and prioritizing this solution:

1. Mechanism of Action: Explain how the solution works, its target(s), 
and the underlying scientific principles or theories.

2. Potential Benefits: Discuss the potential benefits of the solution, 
including the specific aspects of the problem it could address, the expected magnitude and duration of effects,
 and any advantages over existing approaches.

3. Current Research: Summarize the current state of research, including key studies, their findings, 
and the level of evidence supporting the solution's efficacy. Mention any ongoing or planned trials or projects.

4. Estimated Costs: Provide estimates of the costs associated with developing, testing, 
and implementing the solution, including research, trials, production, and distribution.

5. Scalability and Feasibility: Assess the solution's potential for scalability and feasibility,
 considering factors such as ease of implementation, required resources, and potential barriers to widespread adoption.

6. Risks and Potential Negative Consequences: Discuss any known or potential risks, negative consequences,
 or unintended effects associated with the solution, and how they might be mitigated.

7. Cost-Benefit Analysis: Perform a cost-benefit analysis, weighing the estimated costs against the 
potential benefits, considering factors such as the scale and urgency of the problem, and the likelihood of success.

8. Comparison to Alternatives: Compare the solution to other existing or proposed approaches, 
highlighting its relative advantages, disadvantages, and potential synergies.

10. Key Stakeholders and Advocates: Identify the key stakeholders, experts, organizations, and 
advocates working on or supporting this solution, and their perspectives on its potential impact.

The article should be written in an objective, evidence-based manner, providing a information-dense overview of 
the solution to enable readers to make informed decisions about its merits and potential impact on the problem at hand.`;
async function generateGlobalSolutionContent(name: string) {
    return await textCompletion(
        `Write a information-dense article about the global solution of "${name}". 

${sharedSolutionPromptText}
`,
        'text'
    );
}

export async function generateSolutionNamesForGlobalProblem(globalProblem: GlobalProblem): Promise<{name: string, description: string}[]> {
    return await jsonArrayCompletion(` 
Imagine a futuristic utopian world where the problem of "${globalProblem.name}" has been solved.

Return a json array of the 5 best SMART
 (Specific, Measurable, Achievable, Relevant, and Time-bound)
radically innovative solutions the problem of "${globalProblem.name}". 

For each array item should have two properties::
1. 'name': generalized name with the fewest words that captures the essence of the solution 
(we want to minimize variation to avoid duplication with synonyms in the database. For instance, we should have 
"Personalized Cancer Vaccine" and not "Personalized Cancer Vaccine Development" or "Personalized Cancer Vaccine Research")
2. 'description': a brief description of the intervention

            
For instance, for the global problem of "Mental Illness", you could return solutions like:
[
    "Global Treaty to Redirect 1% of Military Spending to Medical Research",
    "Decentralized FDA to Automate Clinical Discovery",
    "Precision Psychiatry Platform",
    "Psychedelic-Assisted Therapy",
    "Gut-Brain Axis Optimization",
    "FAAH Inhibitor Therapies",
    "FAAH-OUT Gene Therapies",
    "Transcranial Focused Ultrasound Stimulation",
    "Ketamine-Assisted Psychotherapy",
    "Psilocybin-Assisted Therapies",
    "MDMA-Assisted Psychotherapy",
    "Neuropeptide-Based Therapies",
    "Microbiome-Based Therapies",
    "Epigenetic Editing Therapies"
]
`);
}

export async function generateGlobalSolutionImages() {
    const solutionsWithoutImages = await prisma.globalSolution.findMany({
        where: {
            featuredImage: null
        }
    });
    console.log(`Generating images for ${solutionsWithoutImages.length} global solutions`);
    let counter = 0;
    for (const globalSolution of solutionsWithoutImages) {
        counter++;
        const percentCompleted = ((counter / solutionsWithoutImages.length) * 100).toFixed(2);
        console.log(`Completed: ${counter}/${solutionsWithoutImages.length} (${percentCompleted}%)`);
        const slug = globalSolution.name.toLowerCase()
            .replace(/ /g, '-');
        const imagePath = `global-solutions/${slugify(slug)}.jpg`
        try {
            const imageUrl = await generateAndUploadFeaturedImageJpg(
                `${globalSolution.name} : ${globalSolution.description}`,
                imagePath);
            await saveGlobalSolutionImage(globalSolution, imageUrl);
        } catch (error) {
            console.error(`Error generating image for global solution: ${globalSolution.name}`);
            console.error(error);
            try {
                const imageUrl = await generateAndUploadFeaturedImageJpg(
                    `${globalSolution.name}`,
                    imagePath);
                await saveGlobalSolutionImage(globalSolution, imageUrl);
            } catch (error) {
                console.error(`Error generating image for global solution: ${globalSolution.name}`);
                console.error(error);
            }
        }
    }
    await dumpTableToJson("GlobalSolution");
}

async function saveGlobalSolutionImage(globalSolution: GlobalSolution, imageUrl: string) {
    return prisma.globalSolution.update({
        where: {
            id: globalSolution.id
        },
        data: {
            featuredImage: imageUrl
        }
    });
}

export async function generalizeGlobalSolutionDescriptions(){
    const globalSolutions = await prisma.globalSolution.findMany();
    const globalSolutionsToUpdate = [];
    for (const globalSolution of globalSolutions) {
        if(!alreadyUpdated(globalSolution)) {
            globalSolutionsToUpdate.push(globalSolution);
        }
    }
    let counter = 0;
    for (const globalSolution of globalSolutionsToUpdate) {
        counter++;
        // Log percent complete
        const percentCompleted = ((counter / globalSolutionsToUpdate.length) * 100).toFixed(2);
        console.log(`Completed: ${counter}/${globalSolutionsToUpdate.length} (${percentCompleted}%)`);
        let updatedDescription = await textCompletion(
            `Provide a one sentence overview about how "${globalSolution.name}" could be used to solve global problems.`,
            'text'
        );
        updatedDescription = formatTextResponse(updatedDescription);
        console.log(`Updated description for ${globalSolution.name}: to 
        ${updatedDescription} 
        instead of
        ${globalSolution.description}`);
        await prisma.globalSolution.update({
            where: {
                id: globalSolution.id
            },
            data: {
                description: updatedDescription
            }
        });
        cacheUpdatedId(globalSolution);
    }
}

function cacheUpdatedId(globalSolution: GlobalSolution) {
    const filePath = absPathFromRepo('updatedGlobalSolutionIds.json');
    // Cache the updated id's to a file so we can avoid duplication
    if(!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([globalSolution.id]));
        return;
    }
    const str = fs.readFileSync(filePath);
    const updatedIds = JSON.parse(str.toString());
    updatedIds.push(globalSolution.id);
    fs.writeFileSync(filePath, JSON.stringify(updatedIds));
}

function alreadyUpdated(globalSolution: GlobalSolution) {
    const filePath = absPathFromRepo('updatedGlobalSolutionIds.json');
    try {
        const str = fs.readFileSync(filePath);
        const updatedIds = JSON.parse(str.toString());
        return updatedIds.includes(globalSolution.id);
    } catch (error) {
        return false;
    }
}

async function generateGlobalSolutionDescription(name: string) {
    const result =  await textCompletion(
        `Create a one sentence description of the global solution "${name}" 
        for an article about how it could be used to solve global problems.`,
        'text'
    );
    return formatTextResponse(result);
}