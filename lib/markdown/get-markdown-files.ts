import { readFile, readdir } from "fs/promises"
import path from "path"

import matter from "gray-matter"

import type { MarkdownFile } from "@/interfaces/markdownFile"

export interface ProcessedMarkdownFile extends MarkdownFile {
  metadata: {
    icon?: string
    [key: string]: any
  }
}

/**
 * Gets and processes all markdown files from a directory
 * @param repoRelativePath Path relative to repository root (e.g. 'public/docs', 'content/blog')
 * @returns Array of processed markdown files with metadata
 * @example
 * // Get all markdown files from public/docs
 * const docs = await getMarkdownFiles('public/docs')
 * 
 * // Get markdown files from content/blog
 * const posts = await getMarkdownFiles('content/blog')
 */
export async function getMarkdownFiles(
  repoRelativePath: string
): Promise<ProcessedMarkdownFile[]> {
  try {
    // Read all files in the directory
    const files = await readdir(path.join(process.cwd(), repoRelativePath))
    
    // Filter for markdown files and remove extension to get slugs
    const markdownSlugs = files
      .filter(file => file.endsWith('.md'))
      .map(file => file.replace('.md', ''))

    const markdownFiles = await Promise.all(
      markdownSlugs.map(async (slug) => {
        const filePath = path.join(process.cwd(), repoRelativePath, `${slug}.md`)
        const content = await readFile(filePath, "utf-8")

        // Parse frontmatter and content
        const { data, content: markdownContent } = matter(content)

        // Extract first H1 title with emoji
        const titleMatch = markdownContent.match(/# ([^\n]+)/)
        const title = titleMatch ? titleMatch[1] : ""

        // Extract emoji from title
        const emojiMatch = title.match(/^([^\w\s]+)/)
        const icon = emojiMatch ? emojiMatch[1].trim() : ""

        // Clean title by removing emoji
        const cleanTitle = title.replace(/^[^\w\s]+\s*/, "").trim()

        return {
          slug,
          name: cleanTitle,
          description: data.description || "",
          content: markdownContent.trim(),
          url: `${repoRelativePath}/${slug}.md`,
          absFilePath: filePath,
          metadata: {
            ...data,
            icon,
          },
        }
      })
    )

    return markdownFiles
  } catch (error) {
    console.error("Error loading markdown files:", error)
    throw new Error("Failed to load markdown files")
  }
} 