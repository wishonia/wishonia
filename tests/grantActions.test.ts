/**
 * @jest-environment node
 */
import { PrismaClient } from "@prisma/client"
import { getOrGenerateGrants } from "@/app/grants/grantActions"

const prisma = new PrismaClient()

describe("Grant Actions tests", () => {
  jest.setTimeout(6000000)

  it("gets or generates grants for an organization", async () => {
    const organizationUrl = "https://www.healthyhabitats.net/"
    const userId = "test-user"
    const result = await getOrGenerateGrants(organizationUrl, userId)
    expect(result).toHaveProperty("success")
    expect(result.organization).not.toBeNull()
    expect(result.organization?.url).toBe("https://healthyhabitats.net")
    expect(Array.isArray(result.grants)).toBe(true)
    expect(result.grants?.length).toBeGreaterThan(0)
  })

  // Add this afterAll hook to close the Prisma connection
  afterAll(async () => {
    await prisma.$disconnect()
  })
})
