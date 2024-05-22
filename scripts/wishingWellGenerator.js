import {generateFeaturedImage} from "@/scripts/imageGenerator";
import {uploadImageToVercel} from "@/lib/wishingWells";

const {generateAndSaveImage} = require("./imageGenerator");
const generateText = require("./textGenerator").generateText;
const slugify = require('slugify');
const fs = require('fs');
const path = require('path');
const {saveMarkdownPost} = require("./markdownGenerator");
const {titleCase} = require("./utils");
const overwrite  = false;
let model = "gpt-4o";
const wishingWellNames = [
    'Cure Aging',
    'Cure Cancer',
    'Cure Depression',
    'End Suffering of Factory Farmed Animals',
    'Stop Global Warming',
    "Cure Alzheimer's Disease",
    'End Malaria',
    'End Starvation',
    'Universal Access to Clean Water',
    'End War',
    'War and Military',
    'Cure Diseases',
    // 'Incarcerate Murders',
    // 'Incarcerate People for Possession of Marijuana',
    // 'Incarcerate People for Possession of MDMA',
    // 'Funding for Nuclear Bombs',
    // 'Abolish Autonomous Weapons Systems',
    // 'Abolish Weapons of Mass Destruction',
    // 'Prevent Child Abuse and Neglect',
    // 'End Terrorism',
    // 'Prevent Genocide',
    // 'Help Refugees',
    // 'End Forced Displacement',
    // 'Clear Landmines and Unexploded Ordinances',
    // 'Reduce Cybercrime',
    // 'Reduce Armed Robbery',
    // 'Reduce Kidnapping',
    // 'Reduce Piracy',
    // 'End Gang Violence',
    // 'Reduce Corruption',
    // 'Reduce Deforestation',
    // 'Reduce Air Pollution',
    // 'Reduce Water Pollution',
    // 'Universal Access to Education',
];

export function generateArticlePrompt(wishingWellName) {
    return `Please create the markdown content of an article about the goal of 
        "${wishingWellName}". in less than 30000 characters. Do not return anything other than the article.
        
# REQUIREMENTS
1. Less than 30000 characters
2. Do not return any statements or text other than the article.
3. Avoid flowery adjectives and keep the article information-dense and informative.
4. Be as objective, analytical, and quantitative as possible and avoid personal opinions or biases.
        
# ARTICLE FORMAT       
The article about the goal of "${wishingWellName}" should include the following sections:

Introduction:
- Brief overview of the goal and its significance to humanity

Reason for the Goal:
- Explain the underlying problems or challenges that the goal aims to address
- Discuss the potential benefits of achieving the goal for individuals, society, and the planet

Magnitude of Impact:
- Estimate the potential increase or decrease in net utility (health and happiness) if the goal were achieved
- Discuss the scale and scope of the impact, both in terms of the number of sentient beings affected and the degree of impact on their lives

Approaches to Achieving the Goal:
- Outline the main strategies, interventions, or solutions proposed to achieve the goal
- Discuss the strengths and weaknesses of each approach, and any evidence supporting their effectiveness

Key Players and Organizations:
- Identify the main individuals, groups, or organizations actively working towards achieving the goal
- Discuss their roles, contributions, and any notable progress or milestones they have achieved

Feasibility and Challenges:
- Assess the overall feasibility of achieving the goal, considering technological, economic, political, and social factors
- Identify the main obstacles or challenges that need to be overcome, and any potential solutions or mitigating strategies

Costs and Resource Requirements:
- Estimate the financial, human, and other resources needed to achieve the goal
- Discuss the potential sources of funding or support, and any trade-offs or opportunity costs involved

Potential Risks and Unintended Consequences:
- Identify any potential negative side effects or unintended consequences of achieving the goal
- Discuss how these risks could be mitigated or managed, and any precautions that should be taken

Beneficiaries and Stakeholders:
- Identify the main groups or populations that would benefit from achieving the goal, and the nature and extent of the benefits they would receive
- Discuss any potential negative impacts on specific groups or stakeholders, and how these could be addressed

Conclusion:
- Summarize the key points and arguments presented in the article
- Provide a final assessment of the overall importance and priority of the goal, considering the various factors discussed
- Offer guidance or recommendations for individuals or organizations considering donating or contributing to efforts to achieve the goal, compared to other potential goals or causes.
         
         `;
}

async function generateAndUploadImageToVercel(obj) {
    const buffer = await generateFeaturedImage(obj.content);
    const slug = obj.name.toLowerCase().replace(/ /g, "-");
    const imageName = `${slug}.png`;
    obj.featuredImage = await uploadImageToVercel(buffer, imageName);
}

async function generateWishingWellMarkdownFile(wishingWellName, markdownPath, imagePath) {
    const description = await generateText(
        `Please generate a sentence description of the goal of "${wishingWellName}" under 240 characters.  
            Do not return anything other than the single sentence description.`, model);
    let prompt = generateArticlePrompt(wishingWellName);
    const content = await generateText(prompt, model);
    await saveMarkdownPost(markdownPath, wishingWellName, description, imagePath, content)
}

export async function wishingWellGenerator() {
    const wishingWells = [];
    for (let wishingWellName of wishingWellNames) {
        wishingWellName = titleCase(wishingWellName)
        const wishingWellSlug = slugify(wishingWellName, { lower: true, strict: true });
        const imagePath = path.join(__dirname, '..', 'public', 'wishingWells',
            `${wishingWellSlug}.png`);
        const markdownPath = path.join(__dirname, '..', 'public', 'wishingWells',
            `${wishingWellSlug}.md`);
        if (overwrite || !fs.existsSync(markdownPath)) {
            await generateWishingWellMarkdownFile(wishingWellName, markdownPath, imagePath);
        }
        if(overwrite || !fs.existsSync(imagePath)) {
            await generateAndSaveImage(`Humanity's Goal of ${wishingWellName}`, imagePath);
        }
        wishingWells.push({
            name: wishingWellName,
            slug: wishingWellSlug,
            imagePath: imagePath,
            markdownPath: markdownPath
        });
    }
    return wishingWells;
}
