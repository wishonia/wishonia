/**
 * @jest-environment node
 */
import {
  dumpFullDatabaseToJson,
  dumpTestDatabaseToJson,
} from "@/lib/prisma/dumpDatabaseToJson"

describe("Database-seeder tests", () => {
  jest.setTimeout(6000000)
  it("Dumps the test database to json files", async () => {
    await dumpTestDatabaseToJson()
  })
  it("Dumps the full database to json files", async () => {
    await dumpFullDatabaseToJson()
  })
})
