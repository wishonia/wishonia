/**
 * @jest-environment node
 */
import {deleteArticleByPromptedTopic, writeArticle} from "@/lib/agents/researcher/researcher";
import { PrismaClient } from '@prisma/client';
import { findOrCreateArticleByPromptedTopic } from '@/lib/agents/researcher/researcher';

const prisma = new PrismaClient();

describe("Database-seeder tests", () => {
  jest.setTimeout(6000000)

  it("Generates article", async () => {
    const topic = `IDO1 inhibitors for depression`
    await deleteArticleByPromptedTopic(topic)
    const generatedReport = await writeArticle(topic, 
      "test-user",
      {
        numberOfSearchQueryVariations: 1,
        numberOfWebResultsToInclude: 10,
        audience: 'researchers',
        purpose: 'research',
        maxCharactersOfSearchContentToUse: 5000,
        tone: 'neutral',
        format: 'article',
        modelName: "claude-3-5-sonnet-20240620",
    })
    const article = await findOrCreateArticleByPromptedTopic(topic)
    expect(article).not.toBeNull()
  })

  // Add this afterAll hook to close the Prisma connection
  afterAll(async () => {
    await prisma.$disconnect();
  });
})
