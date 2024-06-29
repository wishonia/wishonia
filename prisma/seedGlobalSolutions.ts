import { User } from "@prisma/client"

import { loadJsonToDatabase } from "@/lib/prisma/loadDatabaseFromJson"

export async function seedGlobalSolutions(testUser: User) {
  await loadJsonToDatabase("GlobalSolution")
}
