'use server'

import { generateObject } from "ai"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { getModel } from "@/lib/utils/modelUtils"


// Schema for global problems
const GlobalProblemsSchema = z.object({
  problems: z.array(z.object({
    name: z.string().describe("Name of the global problem that could be solved by the wish"),
    description: z.string().describe("Description of how this problem relates to the wish"),
    content: z.string().describe("Detailed explanation of the problem and its connection to the wish"),
  })).length(3).describe("List of exactly 3 global problems that could be solved by fulfilling the wish"),
})

// Schema for global solution
const GlobalSolutionSchema = z.object({
  name: z.string().describe("Name of the solution that would fulfill the wish"),
  description: z.string().describe("Brief description of how this solution would work"),
  content: z.string().describe("Detailed explanation of the solution including actionable steps and potential impact"),
})

// Schema for petition
const PetitionSchema = z.object({
  title: z.string().describe("Compelling title for the petition that will help fulfill the wish"),
  content: z.string().describe("Detailed content explaining why this petition is important and what it aims to achieve"),
  summary: z.string().describe("Brief summary of the petition's goals"),
  targetCount: z.number().min(100).max(10000).describe("Target number of signatures"),
  messageTemplate: z.string().optional().describe("Template message for supporters to send"),
  callScript: z.string().optional().describe("Script for supporters to use when making calls"),
})

async function generateGlobalProblemsFromWish(wish: string, userId: string) {
  const problemsResult = await generateObject({
    model: getModel(),
    schema: GlobalProblemsSchema,
    prompt: `Given this wish: "${wish}", identify exactly 3 significant global problems that could be solved or improved by fulfilling this wish. Each problem should be clearly defined with its connection to the wish explained.`,
  })

  return Promise.all(
    problemsResult.object.problems.map(problem =>
      prisma.globalProblem.create({
        data: {
          name: problem.name,
          description: problem.description,
          content: problem.content,
          userId: userId,
        },
      })
    )
  )
}

async function generateGlobalSolutionFromWish(wish: string, userId: string) {
  const solutionResult = await generateObject({
    model: getModel(),
    schema: GlobalSolutionSchema,
    prompt: `Generate a comprehensive solution for this wish: "${wish}". The solution should be practical, actionable, and explain its potential impact.`,
  })

  return prisma.globalSolution.create({
    data: {
      name: solutionResult.object.name,
      description: solutionResult.object.description,
      content: solutionResult.object.content,
      userId: userId,
    },
  })
}

async function generatePetitionFromWish(wish: string, userId: string) {
  const petitionResult = await generateObject({
    model: getModel(),
    schema: PetitionSchema,
    prompt: `Create a compelling petition to gather support for fulfilling this wish: "${wish}". The petition should motivate people to take action and explain the importance of the cause.`,
  })

  return prisma.petition.create({
    data: {
      title: petitionResult.object.title,
      content: petitionResult.object.content,
      summary: petitionResult.object.summary,
      targetCount: petitionResult.object.targetCount,
      messageTemplate: petitionResult.object.messageTemplate,
      callScript: petitionResult.object.callScript,
      creatorId: userId,
    },
  })
}

export async function submitWish(wish: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error("Must be signed in to make a wish")
  }

  // Create the wish in the database
  const wishingWell = await prisma.wishingWell.create({
    data: {
      name: wish,
      userId: session.user.id,
    },
  })

  // Generate and create problems, solution, and petition in parallel
  await Promise.all([
    generateGlobalProblemsFromWish(wish, session.user.id),
    generateGlobalSolutionFromWish(wish, session.user.id),
    generatePetitionFromWish(wish, session.user.id),
  ])

  revalidatePath("/dashboard/wishingWells")
  return wishingWell
} 