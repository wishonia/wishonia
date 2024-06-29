/**
 * @jest-environment node
 */
import fs from "fs"

import { addModelsToPrismaSchema } from "@/lib/db/dbAgent"

describe("Prisma Editor", () => {
  it("Remove mappings from prisma file", async () => {
    const absPath = fs.realpathSync(`${__dirname}/../prisma/schema.prisma`)
    // Read the file synchronously
    let data = fs.readFileSync(absPath, "utf8")
    // Use regular expressions to remove the tags
    let result = data.replace(/@@map\(".*"\)/g, "")
    result = result.replace(/@map\(".*"\)/g, "")
    fs.writeFileSync(absPath, result, "utf8")
  })
  it("Adds models to prisma file using AI to maintain proper formatting", async () => {
    await addModelsToPrismaSchema()
  })
})
