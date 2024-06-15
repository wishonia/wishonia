import {User} from "@prisma/client";
import {readAllMarkdownFiles} from "@/lib/markdownReader";
import { prisma } from "@/lib/db";

export async function seedGlobalProblemsFromMarkdown(testUser: User) {
    const posts = await readAllMarkdownFiles('public/globalProblems')
    for (const post of posts) {
        // Check if the globalProblem already exists
        const existingProblem = await prisma.globalProblem.findUnique({
            where: {
                name: post.name,
            },
        });

        // If the globalProblem does not exist, create it
        if (!existingProblem) {
            const result = await prisma.globalProblem.create({
                data: {
                    name: post.name,
                    description: post.description,
                    content: post.content,
                    featuredImage: post.featuredImage,
                    userId: testUser.id,
                },
            });
            //console.log("Problem created result: ", result);
        }
    }
}