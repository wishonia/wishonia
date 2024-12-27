import path from "path"

import Link from "next/link"

import { Shell } from "@/components/layout/shell"
import type { MarkdownFile } from "@/lib/markdown/repo-markdown"

import { getDocumentationFiles } from "./actions"
import { DocsSearch } from "./components/docs-search"

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

// Add folder cards data
const folderCards = [
  {
    title: "Cure Acceleration Act",
    description: "Learn about the proposed legislation to accelerate cures",
    icon: "🧪",
    href: "/dfda/docs/cure-acceleration-act",
  },
  {
    title: "Health Savings Sharing",
    description: "Details about the 50/50 health savings sharing program",
    icon: "💰",
    href: "/dfda/docs/health-savings-sharing",
  },
  {
    title: "Blueprint",
    description: "A blueprint for a world without disease",
    icon: "🗺️",
    href: "/dfda/docs/blueprint",
  },
]

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
        
        {/* Folder Cards Grid */}
        <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {folderCards.map((card) => (
            <Link 
              key={card.href}
              href={card.href}
              className="group block rounded-lg border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
            >
              <div className="mb-4 text-4xl">{card.icon}</div>
              <h2 className="mb-2 text-xl font-bold">{card.title}</h2>
              <p className="text-gray-600">{card.description}</p>
            </Link>
          ))}
        </div>

        {/* Existing Search and File List */}
        <DocsSearch files={filesWithTitles} />
      </div>
    </Shell>
  )
}