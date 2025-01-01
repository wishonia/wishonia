/**
 * @jest-environment node
 */
import { PrismaClient } from "@prisma/client"
import {
  generateOrganizationFromUrl,
  generateOrganizationFromUrlBySearch,
  getOrCreateOrganizationFromUrl,
} from "@/lib/agents/researcher/organizationAgent"

const prisma = new PrismaClient()

describe("Organization tests", () => {
  jest.setTimeout(6000000)

  it("generates an organization by URL", async () => {
    const url = "https://curedao.org"
    let userId = "test-user"
    const org = await generateOrganizationFromUrlBySearch(url, userId)
    expect(org).not.toBeNull()
    expect(org.name).toBe("CureDAO")
    expect(org.url).toBe("https://curedao.org")
  })

  it("gets or creates an organization from URL", async () => {
    const url = "https://curedao.org"
    const userId = "test-user"

    // First call should create a new organization
    const org1 = await getOrCreateOrganizationFromUrl(url, userId)
    expect(org1).not.toBeNull()
    expect(org1.url).toBe(url)

    // Second call should retrieve the existing organization
    const org2 = await getOrCreateOrganizationFromUrl(url, userId)
    expect(org2).not.toBeNull()
    expect(org2.id).toBe(org1.id)
    expect(org2.url).toBe(url)
  })

  it("generates an organization directly from URL", async () => {
    const url = "https://curedao.org"

    const org = await generateOrganizationFromUrl(url)

    expect(org).not.toBeNull()
    expect(org.name).toBe("CureDAO")
    expect(org.url).toBe("https://curedao.org")
    expect(org.description).not.toBeNull()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })
}) 