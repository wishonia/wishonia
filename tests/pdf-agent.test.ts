/**
 * @jest-environment node
 */
import { getOrCreateTestUser } from "@/tests/test-helpers"
import { DatasourceType } from "@prisma/client"

import { getOrCreateDataSource } from "@/lib/datasource"
import { PDFLoader } from "@/lib/loaders/pdf"

describe("PDF Agent", () => {
  it("Extracts structured data from PDF", async () => {
    const location = "https://bitcoin.org/bitcoin.pdf"
    const loader = new PDFLoader(location)
    const user = await getOrCreateTestUser()
    const dataSource = await getOrCreateDataSource(
      location,
      DatasourceType.PDF,
      location,
      user.id
    )
    const result = await loader.processSource(dataSource)
    expect(result).toBeDefined()
  })
})
