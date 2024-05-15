import {PrismaClient, User} from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();
async function createTestUser() {
    return prisma.user.create({
        data: {
            email: "test@example.com",
            username: "test-user",
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
    const absolutePath = path.resolve(__dirname, 'problems.json');
    const data = fs.readFileSync(absolutePath, 'utf8');
    const globalProblems = JSON.parse(data);
    for (const problem of globalProblems) {
        let problemData = {
            name: problem.name,
            description: problem.description,
            content: problem.content,
            featuredImage: problem.featuredImage,
            userId: testUser.id,
        };
        debugger
        console.log("Creating problem: ", problemData)
        const result = await prisma.globalProblem.create({
            data: problemData,
        });
        console.log("Problem created result: ", result);
    }
}

async function main() {
    const testUser = await createTestUser();
    await createWishingWells(testUser);
    await createProblems(testUser);
}

main()
    .catch((e) => {
        debugger
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });