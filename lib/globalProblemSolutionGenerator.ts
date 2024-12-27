import fs from "fs"

import { GlobalProblem, GlobalSolution } from "@prisma/client"

import { prisma } from "@/lib/db"
import { absPathFromRepo } from "@/lib/fileHelper"
import { isGoodSolution } from "@/lib/globalSolutions"
import {
  generateGlobalSolution,
  sharedSolutionPromptText,
} from "@/lib/globalSolutionsGenerator"
import { generateAndUploadFeaturedImageJpg } from "@/lib/imageGenerator"
import { textCompletion } from "@/lib/llm"

const generateImages = false
async function generate(
  globalProblem: GlobalProblem,
  globalSolution: GlobalSolution
) {
  const existing = await prisma.globalProblemSolution.findFirst({
    where: {
      globalProblemId: globalProblem.id,
      globalSolutionId: globalSolution.id,
    },
  })
  if (existing) {
    console.log(
      `Already linked ${globalSolution.name} to ${globalProblem.name}`
    )
    return
  }
  console.log(
    `Generating global problem solution for ${globalProblem.name} and ${globalSolution.name}`
  )
  const description = await textCompletion(
    `Write a concise sentence about how the solution "${globalSolution.name}" 
        addresses the global problem "${globalProblem.name}".`,
    "text"
  )
  const content = await generateProblemSolutionContent(
    globalProblem,
    globalSolution
  )
  let featuredImage = globalSolution.featuredImage
  if (!featuredImage && generateImages) {
    featuredImage = await generateAndUploadFeaturedImageJpg(
      `How ${globalSolution.name} Solves ${globalProblem.name}`,
      `global-problem-solutions/${globalProblem.id}-${globalSolution.id}.jpg`
    )
  }
  return prisma.globalProblemSolution.create({
    data: {
      globalProblemId: globalProblem.id,
      globalSolutionId: globalSolution.id,
      name: `How ${globalSolution.name} Solves ${globalProblem.name}`,
      description: description,
      content: content,
      featuredImage: featuredImage,
    },
  })
}

async function generateProblemSolutionContent(
  globalProblem: GlobalProblem,
  globalSolution: GlobalSolution
) {
  return await textCompletion(
    `Write a comprehensive article about how the solution "${globalSolution.name}" addresses the global problem "${globalProblem.name}".
        
        ${sharedSolutionPromptText}
        `,
    "text"
  )
}

export async function generateGlobalProblemSolutions() {
  const globalProblems = await prisma.globalProblem.findMany()
  const globalSolutions = await prisma.globalSolution.findMany()
  const globalProblemSolutions = await prisma.globalProblemSolution.findMany()
  // Calculate the number of combinations of globalProblems and globalSolutions
  const numberOfCombinations = globalProblems.length * globalSolutions.length
  console.log(
    `There are ${numberOfCombinations} possible global problem-solution combinations`
  )
  let count = 0
  for (const globalProblem of globalProblems) {
    for (const globalSolution of globalSolutions) {
      count++
      const percentage = (count / numberOfCombinations) * 100
      console.log(
        `Progress: ${count}/${numberOfCombinations} (${percentage.toFixed(2)}%)`
      )
      if (
        globalProblemSolutions.some(
          (gps) =>
            gps.globalProblemId === globalProblem.id &&
            gps.globalSolutionId === globalSolution.id
        )
      ) {
        console.log(
          `Already linked ${globalSolution.name} to ${globalProblem.name}`
        )
        continue
      }
      if (alreadyUpdated(globalSolution, globalProblem)) {
        console.log(
          `Already checked ${globalSolution.name} for ${globalProblem.name}`
        )
        continue
      }
      if (await isGoodSolution(globalProblem.name, globalSolution.name)) {
        await generate(globalProblem, globalSolution)
      } else {
        console.log(
          `Skipping solution "${globalSolution.name}" because it was not a good solution for ${globalProblem.name}`
        )
      }
      cacheCheckedId(globalSolution, globalProblem)
    }
  }
}

const cacheFilePath = absPathFromRepo("updatedGlobalProblemSolutionIds.json")

function cacheCheckedId(
  globalSolution: GlobalSolution,
  globalProblem: GlobalProblem
) {
  const pair = createCachePair(globalSolution, globalProblem)
  if (!fs.existsSync(cacheFilePath)) {
    fs.writeFileSync(cacheFilePath, JSON.stringify([pair]))
    return
  }
  const updatedIds = getCachedIds()
  updatedIds.push(pair)
  // Save Pretty Print
  fs.writeFileSync(cacheFilePath, JSON.stringify(updatedIds, null, 4))
}

function alreadyUpdated(
  globalSolution: GlobalSolution,
  globalProblem: GlobalProblem
) {
  const updatedIds = getCachedIds()
  return updatedIds.some(
    (pair) =>
      pair.globalSolutionId === globalSolution.id &&
      pair.globalProblemId === globalProblem.id
  )
}

function getCachedIds(): {
  globalSolutionId: string
  globalProblemId: string
}[] {
  if (!fs.existsSync(cacheFilePath)) {
    return []
  }
  const str = fs.readFileSync(cacheFilePath)
  return JSON.parse(str.toString())
}

function createCachePair(
  globalSolution: GlobalSolution,
  globalProblem: GlobalProblem
) {
  return {
    globalSolutionId: globalSolution.id,
    globalProblemId: globalProblem.id,
  }
}

export async function createGlobalProblemSolution(
  globalSolutionName: string,
  globalSolutionDescription: string | null | undefined,
  globalProblem: GlobalProblem
) {
  let existingGlobalSolution = await prisma.globalSolution.findUnique({
    where: {
      name: globalSolutionName,
    },
  })
  if (!existingGlobalSolution) {
    console.log(
      `Solution "${globalSolutionName}" not found, generating new solution`
    )
    existingGlobalSolution = await generateGlobalSolution(
      globalSolutionName,
      globalSolutionDescription,
      globalProblem.userId
    )
  }
  return await generate(globalProblem, existingGlobalSolution)
}
