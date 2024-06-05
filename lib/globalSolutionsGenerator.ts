import slugify from 'slugify';
import {jsonArrayCompletion, textCompletion} from "@/lib/llm";
import { generateAndUploadFeaturedImageJpg } from "@/lib/imageGenerator";
import { prisma } from "@/lib/db";
import {GlobalProblem} from "@prisma/client";
import {generateAndSaveEmbedding, generateOpenAIEmbeddings} from "@/lib/openai";
import {saveMarkdownPost} from "@/lib/markdownGenerator";
import {absPathFromPublic} from "@/lib/fileHelper";
export async function generateGlobalSolutions() {
    const globalProblems = await prisma.globalProblem.findMany();
    let counter = 0;
    for (const globalProblem of globalProblems) {
        console.log(`Generating solutions for global problem: ${globalProblem.name}`)
        const existing = await prisma.globalProblemSolution.findMany({
            where: {
                globalProblemId: globalProblem.id
            }
        });
        if(existing.length > 5) {
            console.log(`Global problem ${globalProblem.name} already has solutions`);
            continue
        }
        // Use textCompletion to ask the LLM to provide an array of the most promising actionable solutions for the given global problem
        const generatedSolutions = await getSolutionArray(globalProblem);
        counter++;
        const totalSolutions = generatedSolutions.length;
        for (const generatedSolution of generatedSolutions) {
            console.log(`Generating solution: ${generatedSolution.name} for problem: ${globalProblem.name}`);
            await saveGlobalSolution(generatedSolution, globalProblem);
        }
        const percentCompleted = ((counter / totalSolutions) * 100).toFixed(2);
        console.log(`Completed: ${counter}/${totalSolutions} (${percentCompleted}%)`);
    }
}

async function linkGlobalProblemSolution(globalProblemId: string, globalSolutionId: string) {
    return prisma.globalProblemSolution.create({
        data: {
            globalProblemId: globalProblemId,
            globalSolutionId: globalSolutionId
        }
    });
}

async function saveGlobalSolution(generatedSolution: {name: string, description: string}, globalProblem: GlobalProblem) {
    const existingSolution = await prisma.globalSolution.findUnique({
        where: {
            name: generatedSolution.name
        }
    });
    if (existingSolution) {
        console.log(`Solution "${generatedSolution.name}" already exists in the database.`);
        await linkGlobalProblemSolution(globalProblem.id, existingSolution.id);
        return;
    }
    const slug = generatedSolution.name.toLowerCase().replace(/ /g, '-');
    const imagePath = `global-solutions/${slugify(slug)}.jpg`
    const mdPath = `global-solutions/${slug}.md`;
    const mdAbsPath = absPathFromPublic(mdPath);
    const content = await generateSolutionContent(generatedSolution);
    //const featuredImageUrl = await generateAndUploadFeaturedImageJpg(generatedSolution.name, imagePath);
    const createdSolution = await prisma.globalSolution.create({
        data: {
            name: generatedSolution.name,
            description: generatedSolution.description,
            content: content,
            // featuredImage: featuredImageUrl,
            userId: globalProblem.userId,
        }
    });
    //await generateAndSaveEmbedding(generatedSolution.name + " " + generatedSolution.description,
    //    'GlobalSolution', createdSolution.id);
    await saveMarkdownPost({
        name: generatedSolution.name,
        description: generatedSolution.description,
        content: content,
        // featuredImage: featuredImageUrl,
        absFilePath: mdAbsPath
    })
    await linkGlobalProblemSolution(globalProblem.id, createdSolution.id);
}

async function generateSolutionContent(generatedSolution: { name: string, description: string}) {
   return await textCompletion(
        `Write a comprehensive article about "${generatedSolution.name}". 

The article should cover the following aspects to help readers make informed decisions
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

The article should be written in an objective, evidence-based manner, providing a comprehensive overview of 
the solution to enable readers to make informed decisions about its merits and potential impact on the problem at hand.
`,
        'text'
    );
}

export async function generateGlobalSolutionEmbeddings(){
    const globalSolutions = await prisma.globalSolution.findMany();
    for (const globalSolution of globalSolutions) {
        await generateAndSaveEmbedding(globalSolution.name + " " + globalSolution.description,
            'GlobalSolution', globalSolution.id);
    }
}
async function getSolutionArray(globalProblem: GlobalProblem): Promise<{name: string, description: string}[]> {
    return await jsonArrayCompletion(
        `
Return a json array of SMART (Specific, Measurable, Achievable, Relevant, and Time-bound)
scientific interventions that could significantly contribute to solving or reducing the
impact of "${globalProblem.name}". 

For each array item should have two properties::
1. 'name': generalized name with the fewest words that captures the essence of the solution 
(we want to minimize variation to avoid duplication with synonyms in the database. For instance, we should have 
"Personalized Cancer Vaccine" and not "Personalized Cancer Vaccine Development" or "Personalized Cancer Vaccine Research")
2. 'description': a brief description of the intervention

Focus on radically innovative and novel solutions.
            
For instance, for the global problem of "Mental Illness", you could return something like:
[
    "Global Treaty to Redirect 1% of Military Spending to Medical Research",
    "A Decentralized FDA to Accelerate Clinical Discovery",
    "Precision Psychiatry International Consortia",
    "Psychedelic-Assisted Therapy Evaluation Trials",
    "Global Neuromodulation Advancement Project",
    "Digital Mental Health Therapeutics Acceleration Network",
    "Gut-Brain Axis Optimization Research",
    "FAAH Inhibitor Therapy",
    "FAAH-OUT Gene Therapy",
    "Optogenetic Brain Stimulation",
    "Transcranial Focused Ultrasound Stimulation",
    "Ketamine-Assisted Psychotherapy",
    "Psilocybin-Assisted Therapy",
    "MDMA-Assisted Psychotherapy",
    "Neuropeptide-Based Therapeutics",
    "Microbiome-Based Interventions",
    "Epigenetic Editing Therapies"
]
`);
}