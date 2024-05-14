import {PrismaClient, User} from "@prisma/client";
import {textCompletion} from "@/lib/llm";

const prisma = new PrismaClient();

const globalProblems = [
    'Cancer (various types)',
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

async function createTestUser() {
    return prisma.user.create({
        data: {
            email: "test@example.com",
            username: "testuser",
            firstName: "Test",
            lastName: "User",
            bio: "I am a test user",
            // Add other user fields as needed
        },
    });
}

async function createWishingWells(testUser: User) {
    // Create the "War and Military Spending" Wishing Well
    const warWishingWell = await prisma.wishingWell.create({
        data: {
            userId: testUser.id,
            name: "Nuclear Bombs",
            description: "Funds allocated to the development and proliferation of nuclear weapons",
            content: "This wishing well represents the funds allocated by governments towards military and defense spending, including weapons development, armed forces, and military infrastructure.",
            images: ["img/nuclear-war.png", "img/nuclear-war.jpg"],
        },
    });

    // Create the "Medical Research" Wishing Well
    const medicalResearchWishingWell = await prisma.wishingWell.create({
        data: {
            userId: testUser.id,
            name: "Cancer Research",
            description: "Funds allocated to medical research to cure cancer",
            content: "This wishing well represents the funds allocated towards medical research, healthcare infrastructure, and initiatives to discover a cure for cancer.",
            images: [
                "img/patient-with-cancer.jpg",
            ],
        },
    });

    const wishingWellPairAllocation = await prisma.wishingWellPairAllocation.create({
        data: {
            userId: testUser.id,
            thisWishingWellId: warWishingWell.id,
            thatWishingWellId: medicalResearchWishingWell.id,
            thisWishingWellPercentage: 60
        },
    });

    console.log("Wishing Wells created:");
    console.log(warWishingWell);
    console.log(medicalResearchWishingWell);

    console.log("Wishing Well Pair Allocation created:");
    console.log(wishingWellPairAllocation);
    return {warWishingWell, medicalResearchWishingWell};
}

async function createProblems(testUser: User) {
    for (const problem of globalProblems) {
        const description = await textCompletion(
            `Please generate a sentence description of the problem of ${problem} under 240 characters.  
            Do not return anything other than the single sentence description.`, "text");
        const content = await textCompletion(`Please create the markdown content of an article about the problem of 
        ${problem} in less than 30000 characters. Do not return anything other than the article. `, "text");
        await prisma.globalProblem.create({
            data: {
                name: problem,
                description: description,
                content: content,
                userId: testUser.id,
            },
        });
    }
}

async function main() {
    const testUser = await createTestUser();
    await createWishingWells(testUser);
    await createProblems(testUser);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });