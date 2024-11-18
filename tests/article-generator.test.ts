/**
 * @jest-environment node
 */
import fs from 'fs/promises'
import path from 'path'
import { ArticleGenerator } from '@/lib/services/article-generator'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })
describe("Article Generator", () => {
  jest.setTimeout(120000) // 2 minute timeout for LLM processing

  const saveArticle = async (filename: string, content: string) => {
    const testOutputDir = path.join(process.cwd(), 'test-output')
    await fs.mkdir(testOutputDir, { recursive: true })
    const absolutePath = path.join(testOutputDir, filename)
    await fs.writeFile(absolutePath, content, 'utf-8')
    console.log('\x1b[36m%s\x1b[0m', `📝 Article saved to: ${absolutePath}`)
    return absolutePath
  }

  const generateMarkdown = (article: any) => {
    let markdown = `# ${article.title}\n\n`
    
    // Add metadata
    markdown += `> Generated: ${new Date().toISOString()}\n`
    markdown += `> Author: ${article.metadata.author}\n`
    markdown += `> Category: ${article.metadata.categories.join(', ')}\n`
    markdown += `> Tags: ${article.metadata.tags.join(', ')}\n\n`
    
    // Add featured image if available
    if (article.featured_image) {
      markdown += `![${article.featured_image_alt}](${article.featured_image})\n\n`
    }
    
    // Add content with images
    markdown += article.content

    // Add SEO metadata
    markdown += '\n\n---\n\n'
    markdown += '## SEO Metadata\n\n'
    markdown += `- Title: ${article.metadata.seo_title}\n`
    markdown += `- Description: ${article.metadata.seo_description}\n`
    markdown += `- Keywords: ${article.metadata.seo_keywords.join(', ')}\n`
    
    return markdown
  }

  it("generates an article with proper source attribution", async () => {
    // Skip if required environment variables are not set
    if (!process.env.TAVILY_API_KEY) {
      throw new Error('TAVILY_API_KEY is not set')
    }
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set')
    }

    const outputDir = path.join(process.cwd(), 'test-output')
    const articleGenerator = new ArticleGenerator(
      process.env.TAVILY_API_KEY,
      outputDir
    )

    const topic = "Latest developments in quantum computing"
    await articleGenerator.generateArticle(topic)

    // Check if the article and raw data files were created
    const articlePath = path.join(
      outputDir, 
      'latest-developments-in-quantum-computing.md'
    )
    const rawDataPath = path.join(
      outputDir, 
      'latest-developments-in-quantum-computing.json'
    )

    // Read both files
    const articleContent = await fs.readFile(articlePath, 'utf-8')
    const rawData = JSON.parse(await fs.readFile(rawDataPath, 'utf-8'))
    
    // Check for markdown links
    const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
    const links = Array.from(articleContent.matchAll(markdownLinkRegex))
    
    // Verify we have links
    expect(links.length).toBeGreaterThan(0)
    
    // Get all URLs from the raw search results
    const sourceUrls = rawData.results.map((result: { url: string }) => result.url)
    
    // Get all URLs from the markdown links
    const linkedUrls = links.map(match => match[2])
    
    // Verify that at least some of our source URLs are used in the article
    const usedSourceUrls = sourceUrls.filter((url: string) => linkedUrls.includes(url))
    expect(usedSourceUrls.length).toBeGreaterThan(0)
    
    // Verify link text is natural (not just "source" or "here")
    links.forEach(([_, linkText]) => {
      expect(linkText.toLowerCase()).not.toBe('source')
      expect(linkText.toLowerCase()).not.toBe('here')
      expect(linkText.length).toBeGreaterThan(3)
    })

    // Log link statistics
    console.log('\x1b[36m%s\x1b[0m', `📝 Link Stats:`)
    console.log('\x1b[36m%s\x1b[0m', `- Total links: ${links.length}`)
    console.log('\x1b[36m%s\x1b[0m', `- Unique sources linked: ${new Set(linkedUrls).size}`)
    console.log('\x1b[36m%s\x1b[0m', `- Source URLs used: ${usedSourceUrls.length}/${sourceUrls.length}`)

    // Log the file location
    console.log('\x1b[36m%s\x1b[0m', `📝 Article saved to: ${articlePath}`)
    console.log('\x1b[36m%s\x1b[0m', `📝 Raw data saved to: ${rawDataPath}`)
  })

  it("generates an article about CRISPR with proper formatting", async () => {
    // Skip if required environment variables are not set
    if (!process.env.TAVILY_API_KEY) {
      throw new Error('TAVILY_API_KEY is not set')
    }
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set')
    }

    const outputDir = path.join(process.cwd(), 'test-output')
    const articleGenerator = new ArticleGenerator(
      process.env.TAVILY_API_KEY,
      outputDir
    )

    const topic = "CRISPR gene editing technology and its medical applications"
    await articleGenerator.generateArticle(topic)

    // Check if the article was created
    const articlePath = path.join(
      outputDir, 
      'crispr-gene-editing-technology-and-its-medical-applications.md'
    )
    const fileExists = await fs.access(articlePath)
      .then(() => true)
      .catch(() => false)

    expect(fileExists).toBe(true)

    // Read and validate the article
    const articleContent = await fs.readFile(articlePath, 'utf-8')
    
    // Content validation
    expect(articleContent).toContain('CRISPR')
    expect(articleContent).toMatch(/!\[.*?\]\(.*?\)/) // Should contain images
    expect(articleContent).toMatch(/\[.*?\]\(.*?\)/) // Should contain links
    expect(articleContent).toContain('## SEO Metadata') // Should have SEO section
    
    // Log the file location
    console.log('\x1b[36m%s\x1b[0m', `📝 Article saved to: ${articlePath}`)
  })
}) 