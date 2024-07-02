/**
 * @jest-environment node
 */
import { seedGlobalProblemPairAllocations } from "@/prisma/seedGlobalProblemPairAllocations"
import { seedWishingWellPairAllocations } from "@/prisma/seedWishingWellPairAllocations"
import { assertTestDB, getOrCreateTestUser } from "@/tests/test-helpers"
import { PrismaClient } from "@prisma/client"

import { aggregateGlobalProblemPairAllocations } from "@/lib/globalProblems"
import {
  aggregateWishingWellPairAllocations,
  saveWishToWishingWell,
} from "@/lib/wishingWells"

let prisma = new PrismaClient()
beforeAll(async () => {
  process.env.DATABASE_URL =
    "postgresql://user:pass@localhost:5433/wishonia_test?schema=public"
  if (!prisma) {
    prisma = new PrismaClient()
  }
  await assertTestDB()
})

describe("Database-related tests", () => {
  it("averages wishingWell allocations", async () => {
    const testUser = await getOrCreateTestUser()
    await prisma.wishingWellPairAllocation.deleteMany({})
    await seedWishingWellPairAllocations(testUser)
    await aggregateWishingWellPairAllocations()
    const wishingWells = await prisma.wishingWell.findMany()
    for (const wishingWell of wishingWells) {
      expect(wishingWell.averageAllocation).toBe(100 / wishingWells.length)
    }
  })
  it("averages globalProblem allocations", async () => {
    const testUser = await getOrCreateTestUser()
    await prisma.globalProblemPairAllocation.deleteMany({})
    await seedGlobalProblemPairAllocations(testUser)
    await aggregateGlobalProblemPairAllocations()
    const globalProblems = await prisma.globalProblem.findMany()
    for (const globalProblem of globalProblems) {
      expect(globalProblem.averageAllocation).toBe(100 / globalProblems.length)
    }
  })
  it("Converts a wish to a wishingWell", async () => {
    const testUser = await getOrCreateTestUser()
    const obj = await saveWishToWishingWell(
      "I wish for world peace",
      testUser.id
    )
    expect(obj).toHaveProperty("description")
    expect(obj).toHaveProperty("name")
    expect(obj).toHaveProperty("content")
  })
})
