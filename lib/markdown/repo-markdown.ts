import { readdir, readFile, stat } from "fs/promises"
import path from "path"

export interface MarkdownFile {
  path: string
  content: string
  title: string
  relativePath: string
}

// Helper function to extract title from markdown content
export function extractTitle(content: string, fallbackPath: string): string {
  // Try to find the first heading
  const headingMatch = content.match(/^#\s+(.+)$/m)
  if (headingMatch) {
    return headingMatch[1]
  }

  // Fallback to filename without extension and path
  const fileName = path.basename(fallbackPath, ".md")
  return fileName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

/**
 * Get markdown files from a directory path relative to repository root
 * @param repoPath Path relative to repository root (e.g. 'public/docs', 'content/blog')
 * @returns Array of markdown files with their contents and metadata
 * @example
 * // Get all markdown files from public/docs
 * const docs = await getMarkdownFilesFromRepo('public/docs')
 *
 * // Get markdown files from content/blog
 * const posts = await getMarkdownFilesFromRepo('content/blog')
 */
export async function getMarkdownFilesFromRepo(
  repoPath: string
): Promise<MarkdownFile[]> {
  const baseDir = path.join(process.cwd(), repoPath)

  async function getFiles(currentDir: string): Promise<MarkdownFile[]> {
    const files = await readdir(currentDir)
    const markdownFiles: MarkdownFile[] = []

    for (const file of files) {
      const filePath = path.join(currentDir, file)
      const stats = await stat(filePath)

      if (stats.isDirectory()) {
        const nestedFiles = await getFiles(filePath)
        markdownFiles.push(...nestedFiles)
      } else if (file.endsWith(".md")) {
        const content = await readFile(filePath, "utf-8")
        const relativePath = path.relative(baseDir, filePath)
        const fullPath = path.relative(process.cwd(), filePath)

        markdownFiles.push({
          path: fullPath,
          relativePath,
          content,
          title: extractTitle(content, relativePath),
        })
      }
    }

    return markdownFiles
  }

  return getFiles(baseDir)
}
