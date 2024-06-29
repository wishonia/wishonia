import { seedWishingWellPairAllocations } from "@/prisma/seedWishingWellPairAllocations"
import { seedWishingWellsFromMarkdown } from "@/prisma/seedWishingWellsFromMarkdown"
import { getOrCreateTestUser } from "@/tests/test-helpers"
import { User } from "@prisma/client"

import { prisma } from "@/lib/db"
import { aggregateWishingWellPairAllocations } from "@/lib/wishingWells"

describe("Wishing Wells", () => {
  it("Seed wishing wells", async () => {
    const testUser = await getOrCreateTestUser()
    await checkWishingWells(testUser)
  }, 45000)
})

async function checkWishingWells<ExtArgs>(testUser: User) {
  console.log("Checking wishing wells")
  await seedWishingWellsFromMarkdown(testUser)
  console.log("Seeded wishing wells")
  console.log("Seeding wishing well pair allocations")
  await seedWishingWellPairAllocations(testUser)
  console.log("Seeded wishing well pair allocations")
  console.log("Aggregating wishing well pair allocations")
  await aggregateWishingWellPairAllocations()
  console.log("Aggregated wishing well pair allocations")
  const wishingWells = await prisma.wishingWell.findMany()
  const total = wishingWells.length
  const expectedAverageAllocation = 100 / total
  const roundedAverageAllocation = Math.round(expectedAverageAllocation)
  for (const problem of wishingWells) {
    if (!problem.averageAllocation) {
      throw new Error("Problem does not have an average allocation")
    }
    const wellRoundedAllocation = Math.round(problem.averageAllocation)
    expect(wellRoundedAllocation).toBe(roundedAverageAllocation)
  }
}
