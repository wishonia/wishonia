// Writes the sample data to prisma/seeds/*.json, the files that
// `pnpm prisma:seed` loads. It skips the auth tables and rows that belong to
// users other than test-user. Pass --full to back up every table to
// prisma/backups/<date>/ instead.
import { prisma } from "@/lib/db"
import {
  dumpFullDatabaseToJson,
  dumpTestDatabaseToJson,
} from "@/lib/prisma/dumpDatabaseToJson"

const full = process.argv.includes("--full")

;(full ? dumpFullDatabaseToJson() : dumpTestDatabaseToJson())
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
