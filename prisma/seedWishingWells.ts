import {getMarkdownObjects} from "@/scripts/markdownReader";
import {PrismaClient, User} from "@prisma/client";
const prisma = new PrismaClient();

export async function seedWishingWells(testUser: User) {
    const wishingWells =
        getMarkdownObjects('public/wishingWells');
    let results = [];
    for (const wishingWell of wishingWells) {
        const existing = await prisma.wishingWell.findUnique({
            where: {
                name: wishingWell.data.name,
            },
        });
        let wishingWellData = {
            name: wishingWell.data.name,
            description: wishingWell.data.description,
            content: wishingWell.content,
            featuredImage: wishingWell.data.featuredImage,
            userId: testUser.id,
        };
        //console.log("Creating wishing well: ", wishingWellData)
        const result = await prisma.wishingWell.upsert({
            where: { name: wishingWell.data.name },
            update: wishingWellData,
            create: wishingWellData,
        });
        //console.log("Wishing well created result: ", result);
        results.push(result)
    }
    return results;
}
