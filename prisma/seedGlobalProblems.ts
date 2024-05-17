import {getMarkdownObjects} from "@/scripts/markdownReader";
import {PrismaClient, User} from "@prisma/client";
const prisma = new PrismaClient();

export async function seedGlobalProblems(testUser: User) {
    const globalProblems =
        getMarkdownObjects('public/globalProblems')
    for (const problem of globalProblems) {
        const result = await prisma.globalProblem.create({
            data: {
                name: problem.data.name,
                description: problem.data.description,
                content: problem.content,
                featuredImage: problem.data.featuredImage,
                userId: testUser.id,
            },
        });
        console.log("Problem created result: ", result);
    }
}
