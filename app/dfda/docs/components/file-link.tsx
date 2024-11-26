"use client"

import Link from "next/link"
import type { MarkdownFile } from "@/lib/markdown/repo-markdown"
import { FileText } from "lucide-react"

interface FileLinkProps {
  file: MarkdownFile;
  searchQuery?: string;
  title?: string;
}

export function FileLink({ file, searchQuery, title }: FileLinkProps): JSX.Element {
  // Get a preview of content if it matches search
  const getContentPreview = () => {
    if (!searchQuery || !file.content) return null
    
    const searchLower = searchQuery.toLowerCase()
    const contentLower = file.content.toLowerCase()
    const index = contentLower.indexOf(searchLower)
    
    if (index === -1) return null
    
    // Get surrounding context (50 chars before and after)
    const start = Math.max(0, index - 50)
    const end = Math.min(file.content.length, index + searchQuery.length + 50)
    const preview = file.content.slice(start, end)
    
    // Highlight the matching text
    const parts = preview.split(new RegExp(`(${searchQuery})`, 'gi'))
    
    return (
      <div className="mt-2 text-sm text-black">
        <p className="line-clamp-2">
          {start > 0 && <span className="text-black/60">...</span>}
          {parts.map((part, i) => (
            part.toLowerCase() === searchQuery.toLowerCase() ? (
              <span key={i} className="border-2 border-black bg-yellow-300 px-1 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                {part}
              </span>
            ) : part
          ))}
          {end < file.content.length && <span className="text-black/60">...</span>}
        </p>
      </div>
    )
  }

  return (
    <Link
      href={`/dfda/docs/${file.relativePath.replace('.md', '')}`}
      className="group block rounded-none border-2 border-black bg-white p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
    >
      <div className="flex items-center gap-3">
        <div className="rounded-none border-2 border-black bg-primary p-2 text-white">
          <FileText className="h-4 w-4" />
        </div>
        <span className="font-bold text-black">{title || file.relativePath}</span>
      </div>
      {getContentPreview()}
    </Link>
  )
}