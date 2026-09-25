// Recomputes every stored allocation share from the pairwise votes. The app
// recomputes a list after each vote on it, so run this after changing the
// aggregation method to update lists that get no new votes.
import { prisma } from "@/lib/db"
import { aggregateGlobalProblemSolutionPairAllocations } from "@/lib/globalProblemSolutionPairAllocations"
import { aggregateGlobalProblemPairAllocations } from "@/lib/globalProblems"
import { aggregateGlobalSolutionPairAllocations } from "@/lib/globalSolutions"
import { aggregateWishingWellPairAllocations } from "@/lib/wishingWells"

async function main() {
  await aggregateGlobalProblemPairAllocations()
  await aggregateGlobalSolutionPairAllocations()
  await aggregateGlobalProblemSolutionPairAllocations()
  await aggregateWishingWellPairAllocations()
  console.log("Recomputed all allocation shares.")
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
