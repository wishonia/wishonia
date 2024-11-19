/**
 * @jest-environment node
 */
import { PrismaClient } from "@prisma/client"

import {
  deleteArticleByPromptedTopic,
  findOrCreateArticleByPromptedTopic, writeArticle,
} from "@/lib/agents/researcher/researcher"
import {
  generateOrganizationFromUrl,
  generateOrganizationFromUrlBySearch, getOrCreateOrganizationFromUrl
} from "@/lib/agents/researcher/organizationAgent";

const prisma = new PrismaClient()

describe("Research Agent tests", () => {
  jest.setTimeout(6000000)

  it("generates an organization by URL", async () => {
    const url = "https://curedao.org"
    let userId = "test-user"
    const org = await generateOrganizationFromUrlBySearch(url, userId)
    expect(org).not.toBeNull()
    expect(org.name).toBe("CureDAO")
    expect(org.url).toBe("https://curedao.org")
  })
  it("Generates article by URL", async () => {
    const url = `https://www.thelancet.com/journals/laninf/article/PIIS1473-3099(23)00685-0/fulltext`
    let userId = "test-user"
    await deleteArticleByPromptedTopic(url, userId)
    const generatedReport = await writeArticle(url, userId, {
      numberOfSearchQueryVariations: 1,
      numberOfWebResultsToInclude: 10,
      audience: "researchers",
      purpose: "research",
      maxCharactersOfSearchContentToUse: 5000,
      tone: "neutral",
      format: "article",
      //modelName: "claude-3-5-sonnet-20240620",
    })
    const article = await findOrCreateArticleByPromptedTopic(url)
    expect(article).not.toBeNull()
  })

  it("Generates article by topic", async () => {
    const topic = `IDO1 inhibitors for depression`
    let userId = "test-user"
    await deleteArticleByPromptedTopic(topic, userId)
    const generatedReport = await writeArticle(topic, userId, {
      numberOfSearchQueryVariations: 1,
      numberOfWebResultsToInclude: 10,
      audience: "researchers",
      purpose: "research",
      maxCharactersOfSearchContentToUse: 5000,
      tone: "neutral",
      format: "article",
      //modelName: "claude-3-5-sonnet-20240620",
    })
    const article = await findOrCreateArticleByPromptedTopic(topic)
    expect(article).not.toBeNull()
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

    // Clean up: delete the created organization
    //await prisma.organization.delete({ where: { id: org1.id } });
  })

  it("generates an organization directly from URL", async () => {
    const url = "https://curedao.org"

    const org = await generateOrganizationFromUrl(url)

    expect(org).not.toBeNull()
    expect(org.name).toBe("CureDAO")
    expect(org.url).toBe("https://curedao.org")
    expect(org.description).not.toBeNull()
    //expect(org.description.length).toBeGreaterThan(0);

    // Optional: Check for other fields if they're likely to be present
    // expect(org.email).not.toBeNull();
    // expect(org.telephone).not.toBeNull();

    // Clean up: delete the created organization
    //await prisma.organization.delete({ where: { id: org.id } });
  })


  // Add this afterAll hook to close the Prisma connection
  afterAll(async () => {
    await prisma.$disconnect()
  })
})
