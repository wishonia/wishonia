/**
 * @jest-environment node
 */
import { MarkdownEnhancer } from "@/lib/content/markdownEnhancer"
import fs from 'fs/promises'
import path from 'path'

describe("MarkdownEnhancer tests", () => {
  jest.setTimeout(1200000) // 2 minute timeout

  const enhancer = new MarkdownEnhancer(process.env.TAVILY_API_KEY || "")
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

  it("enhances a simple markdown article", async () => {
    const content = `
# Depression Treatment Research

Depression is a serious mental health condition that affects millions worldwide. 
Current treatments often have limitations and side effects. 
Some researchers are investigating IDO1 inhibitors as a potential treatment option.

## Current Treatments

SSRIs are commonly prescribed but don't work for everyone. 
Many patients experience side effects like weight gain and sexual dysfunction.

## Future Directions

More research is needed to develop better treatments with fewer side effects.
    `

    const title = "Depression Treatment Research"

    const result = await enhancer.enhance(content, title)
    await saveEnhancedContent('depression-research.md', result.content)

    // Add more specific assertions
    expect(result.success).toBe(true)
    expect(result.content).toBeTruthy()
    
    // Test that links are properly formatted
    expect(result.content).toMatch(/\[([^\]]+)\]\(https?:\/\/[^\)]+\)/)
    
    // Test that no partial words are linked
    expect(result.content).not.toMatch(/\[Is\]/)
    
    // Test that image placeholders are properly formatted
    expect(result.content).toMatch(/!\[.*?\]\(https?:\/\/.*?\)/)
    
    // Test references section format
    expect(result.content).toMatch(/## References\n\d+\. \[.*?\]\(https?:\/\/.*?\)/)
    
    // Test metadata
    expect(result.sources.length).toBeGreaterThan(0)
    expect(result.suggestedImages.length).toBeGreaterThan(0)
    
    // Save metadata
    await saveEnhancedContent('depression-research-metadata.json', JSON.stringify({
      sources: result.sources,
      images: result.suggestedImages,
      stats: {
        termsLinked: result.termsLinked,
        imagesAdded: result.imagesAdded
      }
    }, null, 2))
  })
}) 