import { prisma } from "@/lib/db"
import { getPostgresClient } from "@/lib/db/postgresClient"
import { loadJsonToDatabase } from "@/lib/prisma/loadDatabaseFromJson"

import { seedGlobalProblemPairAllocations } from "./seedGlobalProblemPairAllocations"
import { seedGlobalProblemSolutionPairAllocations } from "./seedGlobalProblemSolutionPairAllocations"
import { seedGlobalSolutionPairAllocations } from "./seedGlobalSolutionPairAllocations"
import { seedUser } from "./seedUser"

// Loads the JSON dumps in prisma/seeds, then adds sample pairwise votes so
// the allocation pages have data.
async function main() {
  const user =
    (await prisma.user.findUnique({ where: { id: "test-user" } })) ??
    (await seedUser())

  await loadJsonToDatabase("User")
  await loadJsonToDatabase("GlobalSolution", user.id)
  await loadJsonToDatabase("GlobalProblem", user.id)
  await loadJsonToDatabase("GlobalProblemSolution", user.id)
  await seedGlobalProblemPairAllocations(user)
  await seedGlobalProblemSolutionPairAllocations(user)
  await seedGlobalSolutionPairAllocations(user)
  await loadJsonToDatabase("WishingWell", user.id)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    // loadJsonToDatabase inserts through a pg pool that would keep the
    // process alive.
    await getPostgresClient().end()
  })
