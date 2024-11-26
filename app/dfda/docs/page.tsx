import path from "path"
import { Shell } from "@/components/layout/shell"
import { getDocumentationFiles } from "./actions"
import { DocsSearch } from "./components/docs-search"
import type { MarkdownFile } from "@/lib/markdown/repo-markdown"

// Helper function to extract title from markdown content
function extractTitle(file: MarkdownFile): string {
  if (!file.content) return getTitleFromPath(file.relativePath)
  
  // Try to get title from first # heading
  const headingMatch = file.content.match(/^#\s+(.+)$/m)
  if (headingMatch) return headingMatch[1]
  
  // Try to get title from frontmatter
  const frontmatterMatch = file.content.match(/^---\s*\ntitle:\s*(.+)\s*\n/m)
  if (frontmatterMatch) return frontmatterMatch[1]
  
  // Fallback to filename
  return getTitleFromPath(file.relativePath)
}

// Helper function to get title from file path
function getTitleFromPath(filePath: string): string {
  return path
    .basename(filePath, '.md')
    .split('-')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export default async function MarkdownPageListPage() {
  const result = await getDocumentationFiles()
  
  if ('error' in result) {
    return (
      <Shell>
        <div className="mx-auto max-w-4xl py-8">
          <h1 className="mb-8 text-3xl font-bold">Documentation</h1>
          <p className="text-red-500">{result.error}</p>
        </div>
      </Shell>
    )
  }

  if (!result.files || result.files.length === 0) {
    return (
      <Shell>
        <div className="mx-auto max-w-4xl py-8">
          <h1 className="mb-8 text-3xl font-bold">Documentation</h1>
          <p>No documentation files found.</p>
        </div>
      </Shell>
    )
  }

  const filesWithTitles = result.files.map(file => ({
    ...file,
    title: extractTitle(file)
  }))

  return (
    <Shell>
      <div className="mx-auto max-w-4xl py-8">
        <h1 className="mb-8 text-3xl font-bold">Documentation</h1>
        <DocsSearch files={filesWithTitles} />
      </div>
    </Shell>
  )
}