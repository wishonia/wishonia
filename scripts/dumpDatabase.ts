// Writes the database tables to prisma/seeds/*.json, the files that
// `pnpm prisma:seed` loads. Pass --test to dump only the rows the test
// dump keeps.
import { prisma } from "@/lib/db"
import {
  dumpFullDatabaseToJson,
  dumpTestDatabaseToJson,
} from "@/lib/prisma/dumpDatabaseToJson"

const testOnly = process.argv.includes("--test")

;(testOnly ? dumpTestDatabaseToJson() : dumpFullDatabaseToJson())
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
