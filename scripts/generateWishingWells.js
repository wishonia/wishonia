const {generateAndSaveImage, convertToRelativePath} = require("./generatePostImage");
const generateText = require("./generateText").generateText;
const slugify = require('slugify');
const fs = require('fs');
const path = require('path');
const {writeFile} = require("fs");
const {saveMarkdownPost} = require("./generateMarkdownPost");
const overwrite  = false;
const wishingWellNames = [
    'Cure Aging',
    'Cure Cancer',
    'Cure for Depression',
    'End Suffering of Factory Farmed Animals',
    'Stop Climate Change',
    "Cure Alzheimer's Disease",
    'Malaria Prevention',
    'End Starvation',
    'Universal Access to Clean Water',
    'Incarcerate Murders',
    'Incarcerate People for Possession of Marijuana',
    'Incarcerate People for Possession of MDMA',
    'Funding for Nuclear Bombs',
    'Abolish Autonomous Weapons Systems',
    'Abolish Weapons of Mass Destruction',
    'Prevent Child Abuse and Neglect',
    // 'Human trafficking',
    'End Terrorism',
    // 'Mass shootings',
    'Prevent Genocide',
    'End War',
    'Help Refugees',
    'End Forced Displacement',
    'Clear Landmines and Unexploded Ordinances',
    'Reduce Cybercrime',
    // 'Burglary and home invasion',
    // 'Armed robbery',
    // 'Carjacking',
    // 'Kidnapping',
    // 'Piracy',
    // 'Drug trafficking and drug-related violence',
    'End Gang Violence',
    // 'Organized crime',
    'Reduce Corruption',
    // 'Poaching and wildlife trafficking',
    'Reduce Deforestation',
    'Reduce Air Pollution',
    'Reduce Water Pollution',
    // 'Soil contamination and degradation',
    // 'Climate change and global warming',
    // 'Natural disasters (earthquakes, hurricanes, floods, etc.)',
    'Universal Access to Education',
    // 'Child labor and exploitation',
];
let wishingWells = [];
async function generateWishingWells() {
    for (const wishingWellName of wishingWellNames) {
        const wishingWellSlug = slugify(wishingWellName, { lower: true, strict: true });
        const imagePath = path.join(__dirname, '..', 'public', 'wishingWells', `${wishingWellSlug}.png`);
        const markdownPath = path.join(__dirname, '..', 'public', 'wishingWells', `${wishingWellSlug}.md`);

        // Check if the markdownPath and imagePath already exist
        if (!overwrite && fs.existsSync(markdownPath) && fs.existsSync(imagePath)) {
            console.log(`Files for ${wishingWellName} already exist. Skipping...`);
            continue;  // Skip to the next wishingWellName
        }

        const description = await generateText(
            `Please generate a sentence description of the wishingWell of ${wishingWellName} under 240 characters.  
            Do not return anything other than the single sentence description.`, "gpt-3.5-turbo");
        const content = await generateText(`Please create the markdown content of an article about the wishingWell of 
        ${wishingWellName} in less than 30000 characters. Do not return anything other than the article. `, "gpt-3.5-turbo");
        if(!overwrite && !fs.existsSync(imagePath)) {
            await generateAndSaveImage(wishingWellName, imagePath);
        }
        let wishingWell = {
            name: wishingWellName,
            description: description,
            content: content,
            featuredImage: convertToRelativePath(imagePath),
        };
        console.log("wishingWell", wishingWell)
        wishingWells.push({...wishingWell});
        await saveMarkdownPost(markdownPath, wishingWellName, description, convertToRelativePath(imagePath), content)
    }
    writeFile('../prisma/wishingWells.json', JSON.stringify(wishingWells, null, 2), (err) => {
        if (err) throw err;
        console.log('The wishingWells file has been saved!');
    });
    console.log(wishingWells);
}

generateWishingWells();
