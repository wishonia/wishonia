import fs from "fs";
import path from "path";

import slugify from "slugify";

import { MarkdownFile } from "@/interfaces/markdownFile";
import { pathToMarkdownUrl } from "@/lib/fileHelper";
import { createGlobalProblem } from "@/lib/globalProblems";
import { generateAndUploadFeaturedImageJpg } from "@/lib/imageGenerator";
import { textCompletion } from "@/lib/llm";
import { saveMarkdownPost } from "@/lib/markdownGenerator";
import { toTitleCase } from "@/lib/stringHelpers";





const overwriteMarkdown = false
const overwriteImages = false
const publicPath = "globalProblems"
const problemNames = [
  "Alzheimer's Disease",
  "Aging",
  "Air Pollution",
  "Animal Suffering",
  "Cancer",
  "Chronic Pain",
  "Cybercrime",
  "Deforestation",
  "Global Warming",
  "Homelessness",
  "Lack of Education",
  "Lack of Access to Clean Water",
  "Malaria",
  "Malnutrition",
  "Mental Illness",
  "Nuclear Weapons",
  "Poverty",
  "Refugee Crises",
  "Violent Conflict",
  "Water Pollution",
]

async function generateDescription(problemName: string) {
  return await textCompletion(
      `Please generate a sentence description of the problem of ${problemName} under 240 characters.  
              Do not return anything other than the single sentence description.`,
      "text"
    );
}

async function generateMarkdown(
  problemName: string,
  markdownPath: string,
  imagePath: string
): Promise<void> {
  problemName = toTitleCase(problemName)
  console.log(`Generating markdown for ${problemName}`)
  const description = await generateDescription(problemName)
  const content = await generateArticleContent(problemName)
  const post = {
    name: problemName,
    description: description,
    content: content,
    featuredImage: imagePath,
    absFilePath: markdownPath,
    url: pathToMarkdownUrl(markdownPath),
  }
  await saveMarkdownPost(post)
}

export async function generateGlobalProblems(): Promise<MarkdownFile[]> {
  const posts: MarkdownFile[] = []
  for (const problemName of problemNames) {
    const problemSlug = slugify(problemName, { lower: true, strict: true })
    const imagePath = path.join(
      __dirname,
      "..",
      "public",
      publicPath,
      `${problemSlug}.png`
    )
    const markdownPath = path.join(
      __dirname,
      "..",
      "public",
      publicPath,
      `${problemSlug}.md`
    )
    if (overwriteMarkdown || !fs.existsSync(markdownPath)) {
      await generateMarkdown(problemName, markdownPath, imagePath)
    } else {
      console.log(`Markdown file already exists for ${problemName}`)
    }
    if (overwriteImages || !fs.existsSync(imagePath)) {
      const imageUrl = await generateAndUploadFeaturedImageJpg(
        `The problem of ${problemName}`,
        imagePath
      )
    } else {
      console.log(`Image already exists for ${problemName}`)
    }
  }
  return posts
}

function generateArticlePrompt(globalProblemName: string): string {
  return `Please create the markdown content of an article about the problem of 
        "${globalProblemName}". in less than 30000 characters. Do not return anything other than the article.
        
# REQUIREMENTS
1. Less than 30000 characters
2. Do not return any statements or text other than the article.
3. Avoid flowery adjectives and keep the article information-dense and informative.
4. Be as objective, analytical, and quantitative as possible and avoid personal opinions or biases.
        
# ARTICLE FORMAT       
The article about the problem of "${globalProblemName}" should include the following sections:

Introduction:
- Brief overview of the problem and its significance to humanity

Causes and Contributing Factors:
- Explain the underlying causes and factors contributing to the problem
- Discuss the historical context and any notable trends or patterns

Impact and Consequences:
- Estimate the negative impact of the problem on net utility (health and happiness)
- Discuss the scale and scope of the impact, both in terms of the number of sentient beings affected and the degree of impact on their lives
- Highlight any secondary or indirect consequences of the problem
- Provide any relevant statistics, data, or evidence to support your claims
- Address any unintended consequences or negative side effects of efforts to address the problem or negative results of actually solving the problem

Current Approaches and Interventions:
- Outline the main strategies, interventions, or solutions currently being used to address the problem
- Discuss the strengths and weaknesses of each approach, and any evidence of their effectiveness

Key Players and Organizations:
- Identify the main individuals, groups, or organizations actively working on addressing the problem
- Discuss their roles, contributions, and any notable progress or milestones they have achieved

Challenges and Obstacles:
- Identify the main challenges and obstacles hindering progress in addressing the problem
- Discuss potential solutions or mitigating strategies to overcome these challenges

Resource Requirements and Costs:
- Estimate the financial, human, and other resources needed to effectively address the problem
- Discuss the current availability and allocation of resources, and any gaps or shortfalls

Potential Future Developments:
- Explore potential future developments or innovations that could help address the problem more effectively
- Discuss any promising research, technologies, or approaches on the horizon

Beneficiaries and Stakeholders:
- Identify the main groups or populations that would benefit from solving the problem, and the nature and extent of the benefits they would receive
- Discuss any potential negative impacts on specific groups or stakeholders, and how these could be addressed

Conclusion:
- Summarize the key points and arguments presented in the article
- Provide a final assessment of the overall importance and priority of addressing the problem, considering the various factors discussed
- Offer guidance or recommendations for individuals or organizations considering donating or contributing to efforts to address the problem, compared to other potential causes or issues.
`
}


async function generateArticleContent(name: string) {
  const prompt = generateArticlePrompt(name)
  return await textCompletion(prompt, "text");
}

export async function generateAndSaveGlobalProblem(name: string,
                                                   userId: string,
                                                   description?: string) {
  try {
    const content = await generateArticleContent(name)
    if (!description) {
      description = await generateDescription(name)
    }
    return await createGlobalProblem(name, description, content, undefined, userId)
  } catch (error) {
    console.error(`Error generating and saving global problem: ${error}`)
    throw error
  }
}
