import fs from 'fs'
import path from 'path'

import matter from 'gray-matter'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import html from 'remark-html'

export interface MarkdownContent {
  html: string
  data: {
    title?: string
    description?: string
    [key: string]: any
  }
}

/**
 * Loads and processes a markdown file from the public directory
 * @param filePath - Path relative to the public directory
 * @returns Processed markdown content with HTML and frontmatter data
 */
export async function getMarkdownContent(filePath: string): Promise<MarkdownContent> {
  // Get the full path to the markdown file
  const fullPath = path.join(process.cwd(), 'public', filePath)
  
  // Read the markdown file
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  // Use gray-matter to parse the metadata section
  const { data, content } = matter(fileContents)

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .use(remarkGfm) // Adds support for GitHub Flavored Markdown
    .process(content)
  
  const htmlContent = processedContent.toString()

  return {
    html: htmlContent,
    data
  }
} 