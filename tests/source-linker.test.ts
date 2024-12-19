/**
 * @jest-environment node
 */
import { SourceLinker } from "@/lib/services/source-linker"
import { TavilyClient } from "@/lib/clients/tavily"
import fs from 'fs/promises'
import path from 'path'

describe("SourceLinker tests", () => {
  jest.setTimeout(1200000) // 2 minute timeout

  const tavilyClient = new TavilyClient(process.env.TAVILY_API_KEY || "")
  const sourceLinker = new SourceLinker(tavilyClient)
  const outputDir = path.join(process.cwd(), 'test-output')

  beforeAll(async () => {
    // Create output directory if it doesn't exist
    await fs.mkdir(outputDir, { recursive: true })
  })

  async function saveEnhancedContent(filename: string, content: string) {
    const filePath = path.join(outputDir, filename)
    await fs.writeFile(filePath, content, 'utf-8')
    console.log(`Saved enhanced content to: ${filePath}`)
  }

  it("automatically adds source links to markdown article with source evaluation", async () => {
    // Define the original file path
    const originalFilePath = path.join(process.cwd(), 'public', 'globalSolutions', 'dfda', 'cure-acceleration-act.md')
    
    // Read the test article
    const content = await fs.readFile(originalFilePath, 'utf-8')

    // Apply auto-linking
    const result = await sourceLinker.autoLinkSources(content)
    
    // Save back to original file
    await fs.writeFile(originalFilePath, result.content, 'utf-8')
    console.log(`Updated original file with enhanced content: ${originalFilePath}`)
    
    // Also save copies to test-output for reference
    await saveEnhancedContent('auto-linked-article.md', result.content)
    
    // Save detailed metadata including source evaluations
    await saveEnhancedContent('auto-linked-metadata.json', JSON.stringify({
      sources: result.sources.map(source => ({
        url: source.url,
        title: source.title,
        evaluation: source.evaluation || null,
      })),
      stats: {
        totalSources: result.sources.length,
        supportingSources: result.sources.filter(s => s.evaluation?.supports).length,
        averageConfidence: result.sources
          .filter(s => s.evaluation?.supports)
          .reduce((acc, s) => acc + (s.evaluation?.confidence || 0), 0) / 
          result.sources.filter(s => s.evaluation?.supports).length,
        uniqueSources: new Set(
          result.sources
            .filter(s => s.evaluation?.supports)
            .map(s => s.url)
        ).size
      }
    }, null, 2))

    // Test assertions
    expect(result.content).toBeTruthy()
    expect(result.content).not.toBe(content) // Content should be modified
    
    // Test that links are properly formatted
    expect(result.content).toMatch(/\[([^\]]+)\]\(https?:\/\/[^\)]+\)/)
    
    // Test that no partial words are linked
    expect(result.content).not.toMatch(/\[Is\]/)
    
    // Test that we found some sources
    expect(result.sources.length).toBeGreaterThan(0)
    
    // Test source evaluations
    result.sources.forEach(source => {
      expect(source.url).toBeTruthy()
      expect(source.title).toBeTruthy()
      
      // If there's an evaluation, verify its structure
      if (source.evaluation) {
        expect(typeof source.evaluation.supports).toBe('boolean')
        expect(typeof source.evaluation.confidence).toBe('number')
        expect(source.evaluation.confidence).toBeGreaterThanOrEqual(0)
        expect(source.evaluation.confidence).toBeLessThanOrEqual(1)
        expect(typeof source.evaluation.explanation).toBe('string')
        expect(source.evaluation.explanation.length).toBeGreaterThan(0)
      }
    })

    // Test that we have at least some supporting sources
    const supportingSources = result.sources.filter(s => s.evaluation?.supports)
    expect(supportingSources.length).toBeGreaterThan(0)

    // Test references section
    expect(result.content).toMatch(/\n## References\n/)
    expect(result.content).toMatch(/\d+\. \[.*?\]\(https?:\/\/.*?\)/)

    // Test that each supporting source appears exactly once in references
    const referenceUrls = new Set()
    const referenceMatches = result.content.match(/\n\d+\. \[.*?\]\((https?:\/\/[^\)]+)\)/g) || []
    referenceMatches.forEach(match => {
      const urlMatch = match.match(/\((https?:\/\/[^\)]+)\)/)
      if (!urlMatch) {
        throw new Error(`Invalid reference format: ${match}`)
      }
      const url = urlMatch[1]
      expect(referenceUrls.has(url)).toBe(false) // URL should not be duplicate
      referenceUrls.add(url)
    })

    // Verify all supporting sources are in references
    supportingSources.forEach(source => {
      expect(result.content).toContain(source.url)
    })
  })
}) 