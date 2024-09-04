/**
 * @jest-environment node
 */
import { seedGlobalProblemPairAllocations } from "@/prisma/seedGlobalProblemPairAllocations"
import { seedGlobalProblemSolutionPairAllocations } from "@/prisma/seedGlobalProblemSolutionPairAllocations"
import { seedGlobalSolutionPairAllocations } from "@/prisma/seedGlobalSolutionPairAllocations"
import { assertTestDB, getOrCreateTestUser } from "@/tests/test-helpers"

import { loadJsonToDatabase } from "@/lib/prisma/loadDatabaseFromJson"
import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

beforeAll(async () => {
  await assertTestDB()
})

describe("Database-seeder tests", () => {
  jest.setTimeout(6000000)
  it("Seeds from JSON dump", async () => {
    const testUser = await getOrCreateTestUser()
    await loadJsonToDatabase("User")
    await loadJsonToDatabase("GlobalSolution", testUser.id)
    await loadJsonToDatabase("GlobalProblem", testUser.id)
    await loadJsonToDatabase("GlobalProblemSolution", testUser.id)
    await seedGlobalProblemPairAllocations(testUser)
    await seedGlobalProblemSolutionPairAllocations(testUser)
    await seedGlobalSolutionPairAllocations(testUser)
    await loadJsonToDatabase("WishingWell", testUser.id)
  })

  it("Imports DfdaCause from JSON file", async () => {
    const prisma = new PrismaClient()

    // Read the JSON file
    const jsonPath = path.join(process.cwd(), 'prisma', 'ct_causes.json')
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))

    // Import the data
    for (const cause of jsonData) {
      await prisma.dfdaCause.create({
        data: {
          id: cause.id,
          name: cause.name,
          updatedAt: new Date(cause.updated_at),
          createdAt: new Date(cause.created_at),
          deletedAt: cause.deleted_at ? new Date(cause.deleted_at) : null,
          numberOfConditions: cause.number_of_conditions,
        },
      })
    }
  })
})
