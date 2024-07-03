/**
 * @jest-environment node
 */
import { seedGlobalProblemPairAllocations } from "@/prisma/seedGlobalProblemPairAllocations"
import { seedGlobalProblemsFromMarkdown } from "@/prisma/seedGlobalProblemsFromMarkdown"
import { seedGlobalProblemSolutionPairAllocations } from "@/prisma/seedGlobalProblemSolutionPairAllocations"
import { seedGlobalSolutionPairAllocations } from "@/prisma/seedGlobalSolutionPairAllocations"
import { seedGlobalSolutions } from "@/prisma/seedGlobalSolutions"
import { globalSolutionNames } from "@/prisma/seeds/globalSolutionNames"
import {
  assertTestDB,
  getOrCreateTestUser,
  truncateAllTables,
} from "@/tests/test-helpers"
import { User } from "@prisma/client"

import GlobalSolutionDecomposerAgent from "@/lib/agents/taskGenerationAgent"
import {
  medicalResearchGlobalSolutionId,
  warGlobalSolutionId,
} from "@/lib/api/warVsCures"
import { prisma } from "@/lib/db"
import { aggregateGlobalProblemPairAllocations } from "@/lib/globalProblems"
import {
  createGlobalProblemSolution,
  generateGlobalProblemSolutions,
} from "@/lib/globalProblemSolutionGenerator"
import { aggregateGlobalProblemSolutionPairAllocations } from "@/lib/globalProblemSolutionPairAllocations"
import {
  aggregateGlobalSolutionPairAllocations,
  dumpGlobalSolutionNames,
  updateOrCreateGlobalSolutionPairAllocation,
} from "@/lib/globalSolutions"
import {
  generalizeGlobalSolutionDescriptions,
  generateGlobalSolution,
  generateGlobalSolutionImages,
  generateGlobalSolutions,
} from "@/lib/globalSolutionsGenerator"
import { loadJsonToDatabase } from "@/lib/prisma/loadDatabaseFromJson"

describe("Global Problem Solutions", () => {
  jest.setTimeout(6000000)
  it("Decomposes a GlobalSolution to GlobalTasks", async () => {
    const globalProblemSolution = await prisma.globalProblemSolution.findFirst({
      where: {
        globalProblemId: "cancer",
      },
    })
    if (!globalProblemSolution)
      throw new Error("Global Problem Solution not found")
    const globalSolution = await prisma.globalSolution.findFirst({
      where: {
        id: globalProblemSolution.globalSolutionId,
      },
    })
    if (!globalSolution) throw new Error("Global Solution not found")
    const user = await getOrCreateTestUser()

    const agent = new GlobalSolutionDecomposerAgent()

    console.log(
      `Starting decomposition of Global Solution: "${globalSolution.name}"`
    )

    const result = await agent.decomposeAndStore(globalSolution.name, user.id)
    console.log(result)

    // Fetch and display the created tasks
    const createdTasks = await prisma.globalTask.findMany({
      where: {
        globalSolutionTasks: {
          some: {
            globalSolution: {
              name: globalSolution.name,
            },
          },
        },
      },
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
        globalTaskContextUrls: true,
      },
    })

    console.log(`Created ${createdTasks.length} tasks:`)
    for (const task of createdTasks) {
      console.log(
        `- ${task.name} (Priority: ${task.priority}, Status: ${task.status})`
      )
      if (task.skills.length > 0) {
        console.log(
          `  Skills: ${task.skills.map((s) => s.skill.name).join(", ")}`
        )
      }
      if (task.globalTaskContextUrls.length > 0) {
        console.log(
          `  Context URLs: ${task.globalTaskContextUrls.map((u) => u.url).join(", ")}`
        )
      }
    }
  })
  it("Generates a global Solution", async () => {
    const user = await getOrCreateTestUser()
    await generateGlobalSolution("Military", null, user.id)
  })
  it("Adds missing images to GlobalProblemSolutions", async () => {
    const globalProblemSolutions = await prisma.globalProblemSolution.findMany({
      where: {
        globalProblemId: "aging",
      },
    })
    for (const globalProblemSolution of globalProblemSolutions) {
      const globalSolution = await prisma.globalSolution.findFirst({
        where: {
          id: globalProblemSolution.globalSolutionId,
        },
      })
      if (!globalSolution) throw new Error("Global Problem not found")
      if (!globalSolution.featuredImage)
        throw new Error("Global Problem has no featured image")
      await prisma.globalProblemSolution.update({
        where: {
          id: globalProblemSolution.id,
        },
        data: {
          featuredImage: globalSolution.featuredImage,
        },
      })
    }
  })
  it("Aggregates GlobalProblemSolutionPairAllocations", async () => {
    await seedGlobalProblemSolutionPairAllocations(await getOrCreateTestUser())
    await aggregateGlobalProblemSolutionPairAllocations()
  })
  it("Creates Global Problem Solutions for Aging", async () => {
    const globalProblem = await prisma.globalProblem.findFirst({
      where: {
        name: "Aging",
      },
    })
    if (!globalProblem) throw new Error("Global Problem Aging not found")
    for (const title of globalSolutionNames.aging) {
      await createGlobalProblemSolution(title, null, globalProblem)
    }
  })
  it("Dumps the names of the global solutions", async () => {
    await dumpGlobalSolutionNames()
  })
  it("Generates GlobalSolution images", async () => {
    await generateGlobalSolutionImages()
  }, 6000000)
  it("Creates global problem solutions from names", async () => {
    const globalProblem = await prisma.globalProblem.findFirst({
      where: {
        name: "Aging",
      },
    })
    if (!globalProblem) throw new Error("Global Problem Aging not found")
    for (const globalSolutionName of globalSolutionNames.aging) {
      await createGlobalProblemSolution(globalSolutionName, null, globalProblem)
    }
    await seedGlobalProblemSolutionPairAllocations(await getOrCreateTestUser())
  })
  it("Generates Global Problem Pair Allocations", async () => {
    await seedGlobalProblemPairAllocations(await getOrCreateTestUser())
  })
  it("Generates GlobalProblemSolutions", async () => {
    await checkGlobalSolutions(await getOrCreateTestUser())
  })
  it("seeds DB with user, wishing wells and problems", async () => {
    await assertTestDB()
    await truncateAllTables()
    const testUser = await getOrCreateTestUser()
    await checkGlobalProblems(testUser)
    await checkGlobalSolutions(testUser)
  }, 45000)

  it("Seed GlobalProblemSolutions", async () => {
    await checkGlobalProblemSolutions(await getOrCreateTestUser())
  })
  it("Aggregates global problem pair allocations", async () => {
    await aggregateGlobalProblemSolutionPairAllocations()
  })
  it("Seed global problems and solutions", async () => {
    await loadJsonToDatabase("GlobalProblemSolution")
  }, 6000000)
  it("Generate global solutions", async () => {
    await generateGlobalSolutions()
  }, 6000000)
  it("Seed global solutions", async () => {
    await checkGlobalSolutions(await getOrCreateTestUser())
  }, 6000000)
  it("Generates GlobalProblemSolutions", async () => {
    await generateGlobalProblemSolutions()
  }, 6000000)
  it("Generalizes the GlobalSolution descriptions", async () => {
    await generalizeGlobalSolutionDescriptions()
  })
  it("Updates or creates GlobalSolutionPairAllocations", async () => {
    const warPercentageDesired = 5
    await updateOrCreateGlobalSolutionPairAllocation(
      warGlobalSolutionId,
      medicalResearchGlobalSolutionId,
      warPercentageDesired,
      "test-user"
    )
    const globalSolutions = await prisma.globalSolution.findMany()
    expect(globalSolutions.length).toBeGreaterThan(0)
    const warGlobalSolution = globalSolutions.find(
      (solution) => solution.id === warGlobalSolutionId
    )
    if (!warGlobalSolution) throw new Error("War Global Solution not found")
    if (
      warGlobalSolution.averageAllocation == null ||
      typeof warGlobalSolution.averageAllocation !== "number"
    ) {
      throw new Error("War Global Solution average allocation not updated")
    }
  })
})

async function checkGlobalSolutions<ExtArgs>(testUser: User) {
  console.log("Checking global solutions")
  console.log("Seeding global solutions")
  await seedGlobalSolutions(testUser)
  await loadJsonToDatabase("GlobalProblemSolution")
  console.log("Seeded global solutions")
  console.log("Seeding global solution pair allocations")
  await seedGlobalSolutionPairAllocations(testUser)
  console.log("Seeded global solution pair allocations")
  console.log("Aggregating global solution pair allocations")
  await aggregateGlobalSolutionPairAllocations()
  console.log("Aggregated global solution pair allocations")
  const globalSolutions = await prisma.globalSolution.findMany()
  const total = globalSolutions.length
  const expectedAverageAllocation = 100 / total
  for (const problem of globalSolutions) {
    expect(problem.averageAllocation).toBe(expectedAverageAllocation)
  }
}

async function checkGlobalProblems<ExtArgs>(testUser: User) {
  console.log("Checking global problems")
  console.log("Seeding global problems")
  await seedGlobalProblemsFromMarkdown(testUser)
  console.log("Seeded global problems")
  console.log("Seeding global problem pair allocations")
  await seedGlobalProblemPairAllocations(testUser)
  console.log("Seeded global problem pair allocations")
  console.log("Aggregating global problem pair allocations")
  await aggregateGlobalProblemPairAllocations()
  console.log("Aggregated global problem pair allocations")
  const globalProblems = await prisma.globalProblem.findMany()
  const total = globalProblems.length
  const expectedAverageAllocation = 100 / total
  for (const problem of globalProblems) {
    expect(problem.averageAllocation).toBe(expectedAverageAllocation)
  }
}

async function checkGlobalProblemSolutions<ExtArgs>(testUser: User) {
  console.log("Checking globalProblemSolutions")
  console.log("Seeding globalProblemSolutions")
  //await seedGlobalProblemSolutions(testUser);
  console.log("Seeded globalProblemSolutions")
  console.log("Seeding globalProblemSolution pair allocations")
  await seedGlobalProblemSolutionPairAllocations(testUser)
  console.log("Seeded globalProblemSolution pair allocations")
  console.log("Aggregating globalProblemSolution pair allocations")
  await aggregateGlobalProblemSolutionPairAllocations()
  console.log("Aggregated globalProblemSolution pair allocations")
  const globalProblemSolutions = await prisma.globalProblemSolution.findMany()
  const total = globalProblemSolutions.length
  const expectedAverageAllocation = 100 / total
  for (const problem of globalProblemSolutions) {
    expect(problem.averageAllocation).toBe(expectedAverageAllocation)
  }
}
