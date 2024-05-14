const {generateAndSaveImage} = require("./generatePostImage");
const generateText = require("./generateText").generateText;
const slugify = require('slugify');
const path = require('path');
const {writeFile} = require("fs");
const {saveMarkdownPost} = require("./generateMarkdownPost");

const problemNames = [
    'Cancer',
    'Heart disease',
    'Stroke',
    "Alzheimer's disease",
    'Diabetes',
    'Chronic obstructive pulmonary disease (COPD)',
    'Kidney disease',
    'Influenza and pneumonia',
    'Malaria',
    'Tuberculosis',
    'HIV/AIDS',
    'Ebola',
    'Zika virus',
    'COVID-19',
    'Sepsis',
    'Antibiotic-resistant infections',
    'Malnutrition and hunger',
    'Lack of access to clean water and sanitation',
    'Homicide',
    'Rape and sexual assault',
    'Domestic violence',
    'Child abuse and neglect',
    'Human trafficking',
    'Terrorism',
    'Mass shootings',
    'Genocide',
    'War crimes',
    'Civil wars and armed conflicts',
    'Refugee crises',
    'Forced displacement',
    'Landmines and unexploded ordnance',
    'Cybercrime and identity theft',
    'Burglary and home invasion',
    'Armed robbery',
    'Carjacking',
    'Kidnapping',
    'Piracy',
    'Drug trafficking and drug-related violence',
    'Gang violence',
    'Organized crime',
    'Corruption and bribery',
    'Poaching and wildlife trafficking',
    'Deforestation and habitat destruction',
    'Air pollution and smog',
    'Water pollution and contamination',
    'Soil contamination and degradation',
    'Climate change and global warming',
    'Natural disasters (earthquakes, hurricanes, floods, etc.)',
    'Lack of access to education',
    'Child labor and exploitation',
];
let problems = [];
async function generateProblems() {
    for (const problemName of problemNames) {
        const description = await generateText(
            `Please generate a sentence description of the problem of ${problemName} under 240 characters.  
            Do not return anything other than the single sentence description.`, "gpt-3.5-turbo");
        const content = await generateText(`Please create the markdown content of an article about the problem of 
        ${problemName} in less than 30000 characters. Do not return anything other than the article. `, "gpt-3.5-turbo");
        const problemSlug = slugify(problemName, { lower: true, strict: true });
        const imagePath = path.join(__dirname, '..', 'public', 'problems', `${problemSlug}.png`);
        const markdownPath = path.join(__dirname, '..', 'public', 'problems', `${problemSlug}.md`);
        await generateAndSaveImage(problemName, imagePath);
        let problem = {
            name: problem,
            description: description,
            content: content,
        };
        console.log("problem", problem)
        problems.push({...problem});
        await saveMarkdownPost(markdownPath, problemName, description, imagePath, content)
    }
    writeFile('problems.json', JSON.stringify(problems, null, 2), (err) => {
        if (err) throw err;
        console.log('The problems file has been saved!');
    });
    console.log(problems);
}

generateProblems();
