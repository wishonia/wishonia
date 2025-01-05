/**
 * @jest-environment node
 */
import { PrismaClient } from "@prisma/client"
import fs from 'fs/promises'
import path from 'path'
import {
  deleteArticleByPromptedTopic,
  findOrCreateArticleByPromptedTopic,
  writeArticle,
} from "@/lib/agents/researcher/researcher"

const prisma = new PrismaClient()

const researchQuestions = [
  "What is the Medicare spending reduction in dollars when muscle mass increases by 2 lb across the entire US Medicare population through reduced hospital visits?",
  // "What is the Medicare spending reduction in dollars when fat mass decreases by 2 lb across the entire US Medicare population?",
  // "What is the reduction in hip fracture incidence and associated Medicare costs in dollars when muscle mass increases by 2 lb in the entire US Medicare population?",
  // "What is the GDP impact in dollars of a 2 point IQ increase across the entire US adult workforce?",
  // "What is the GDP impact in dollars of a 3 point IQ increase across the entire US adult workforce?",
  // "What is the GDP impact in dollars of a 4 point IQ increase across the entire US adult workforce?",
  // "What is the GDP impact in dollars of a 5 point IQ increase across the entire US adult workforce?",
  // "What is the Medicare spending reduction in dollars when Klotho slows Alzheimer's disease progression?",
  // "What is the Medicare spending reduction in dollars when Klotho improves eGFR levels in kidney disease patients?",
  // "What is the Medicare spending reduction in dollars when Klotho improves cystatin C levels in kidney disease patients?",
  // "What is the GDP impact in dollars of a 2.5% increase in life expectancy across the entire US population?",
  // "What is the Medicare spending reduction in dollars from a 2.5% increase in life expectancy across the entire US population?",
  // "What is the Medicare spending reduction in dollars when follistatin increases muscle mass by 2 lb in only the US population over age 60?",
  // "What is the Medicare spending reduction in dollars when follistatin decreases fat mass by 2 lb in only the US population over age 60?",
  // "What is the Medicare spending reduction in dollars when Klotho slows Alzheimer's progression in only the US population over age 60?",
  // "What is the GDP impact in dollars of Klotho improving kidney function biomarkers in only the US working adult population?",
  // "What is the reduction in dollars of annual dialysis costs when Klotho improves kidney function biomarkers?",
  // "What is the reduction in annual caregiver costs in dollars when Klotho slows Alzheimer's progression?",
  // "What is the disability-adjusted life years (DALYs) impact when muscle mass increases by 2 lb across the entire US population?",
  // "What is the quality-adjusted life years (QALYs) impact when muscle mass increases by 2 lb across the entire US population?",
  // "What is the disability-adjusted life years (DALYs) impact when Klotho slows Alzheimer's progression?",
  // "What is the quality-adjusted life years (QALYs) impact when Klotho slows Alzheimer's progression?",
  // "What is the disability-adjusted life years (DALYs) impact when Klotho improves kidney function biomarkers?",
  // "What is the quality-adjusted life years (QALYs) impact when Klotho improves kidney function biomarkers?",
  // "What is the disability-adjusted life years (DALYs) impact of a 2.5% increase in life expectancy across the entire US population?",
  // "What is the quality-adjusted life years (QALYs) impact of a 2.5% increase in life expectancy across the entire US population?"

]

describe("Research Questions", () => {
  jest.setTimeout(6000000) // 100 minutes timeout

  it("Generates articles for all research questions", async () => {
    const userId = "test-user"
    const outputDir = path.join(process.cwd(), 'public', 'research-articles')
    
    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true })

    for (let i = 0; i < researchQuestions.length; i++) {
      const question = researchQuestions[i]
      console.log(`Processing question ${i + 1}/${researchQuestions.length}:`, question)
      
      // Delete any existing article
      await deleteArticleByPromptedTopic(question, userId)
      
      // Generate new article
      const generatedReport = await writeArticle(question, userId, {
        numberOfSearchQueryVariations: 2,
        numberOfWebResultsToInclude: 15,
        audience: "researchers",
        purpose: "research",
        maxCharactersOfSearchContentToUse: 10000,
        tone: "neutral",
        format: "article"
      })

      // Save to database
      const article = await findOrCreateArticleByPromptedTopic(question)
      expect(article).not.toBeNull()

      // Save to markdown file
      const filename = `question-${i + 1}.md`
      const filePath = path.join(outputDir, filename)
      await fs.writeFile(filePath, `# ${question}\n\n${article?.content || generatedReport}`)
    }
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })
}) 