import { User } from "@prisma/client"

import { prisma } from "@/lib/db"
import { createGlobalProblem } from "@/lib/globalProblems"
import { readAllMarkdownFiles } from "@/lib/markdownReader"

export async function seedGlobalProblemsFromMarkdown(testUser: User) {
  const posts = await readAllMarkdownFiles("public/globalProblems")
  for (const post of posts) {
    // Check if the globalProblem already exists
    const existingProblem = await prisma.globalProblem.findUnique({
      where: {
        name: post.name,
      },
    })

    if (!post.description) {
      throw new Error(`Description not found for global problem: ${post.name}`)
    }

    // If the globalProblem does not exist, create it
    if (!existingProblem) {
      const result = await createGlobalProblem(
        post.name,
        post.description,
        post.content,
        post.featuredImage,
        testUser.id
      )
      //console.log("Problem created result: ", result);
    }
  }
}
