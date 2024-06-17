import {User} from "@prisma/client";
import {readAllMarkdownFiles} from "@/lib/markdownReader";
import { prisma } from "@/lib/db";

export async function seedWishingWellsFromMarkdown(testUser: User) {
    const posts = await readAllMarkdownFiles('public/wishingWells');
    let results = [];
    for (const post of posts) {
        const existing = await prisma.wishingWell.findUnique({
            where: {
                name: post.name,
            },
        });
        let wishingWellData = {
            name: post.name,
            description: post.description,
            content: post.content,
            featuredImage: post.featuredImage,
            userId: testUser.id,
        };
        //console.log("Creating wishing well: ", wishingWellData)
        const result = await prisma.wishingWell.upsert({
            where: { name: post.name },
            update: wishingWellData,
            create: wishingWellData,
        });
        //console.log("Wishing well created result: ", result);
        results.push(result)
    }
    return results;
}
