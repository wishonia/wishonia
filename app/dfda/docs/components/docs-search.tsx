'use client'

import path from "path"

import { useState } from "react"

import type { MarkdownFile } from "@/lib/markdown/repo-markdown"

import { FileLink } from "./file-link"
import { SearchFilter } from "./search-filter"

interface DocsSearchProps {
  files: (MarkdownFile & { title: string })[]
}

export function DocsSearch({ files }: DocsSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredFiles = files.filter((file) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      file.title.toLowerCase().includes(searchLower) ||
      file.relativePath.toLowerCase().includes(searchLower) ||
      file.content?.toLowerCase().includes(searchLower)
    )
  })

  const groupedFiles = Object.entries(
    filteredFiles.reduce((acc: Record<string, typeof files>, file) => {
      const dirPath = path.dirname(file.relativePath)
      if (!acc[dirPath]) {
        acc[dirPath] = []
      }
      acc[dirPath].push(file)
      return acc
    }, {})
  )

  return (
    <>
      <SearchFilter onSearch={setSearchQuery} />
      <div className="space-y-4">
        {groupedFiles.map(([dirPath, files]) => (
          <div
            key={dirPath}
            className="rounded-lg border border-border bg-white p-4"
          >
            <h2 className="mb-3 text-xl font-semibold">
              {dirPath === "." ? "Root" : dirPath}
            </h2>
            <div className="space-y-2 pl-4">
              {files.map((file) => (
                <FileLink 
                  key={file.path} 
                  file={file} 
                  searchQuery={searchQuery}
                  title={file.title}
                />
              ))}
            </div>
          </div>
        ))}
        {groupedFiles.length === 0 && (
          <p className="text-muted-foreground">No matching documentation found.</p>
        )}
      </div>
    </>
  )
} 