/**
 * @jest-environment node
 */
import {deleteArticleByPromptedTopic, writeArticle} from "@/lib/agents/researcher/researcher";
import { PrismaClient } from '@prisma/client';
import { findOrCreateArticleByPromptedTopic } from '@/lib/agents/researcher/researcher';

const prisma = new PrismaClient();

describe("Research Agent tests", () => {
  jest.setTimeout(6000000)

    it("Generates article by URL", async () => {
        const url = `https://www.thelancet.com/journals/laninf/article/PIIS1473-3099(23)00685-0/fulltext`
        let userId = "test-user";
        await deleteArticleByPromptedTopic(url, userId)
        const generatedReport = await writeArticle(url,
          userId,
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
        const article = await findOrCreateArticleByPromptedTopic(url)
        expect(article).not.toBeNull()
    });

  it("Generates article by topic", async () => {
    const topic = `IDO1 inhibitors for depression`
      let userId = "test-user";
      await deleteArticleByPromptedTopic(topic, userId)
    const generatedReport = await writeArticle(topic, 
      userId,
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
