import path from "path"

import {
  getMarkdownFilesFromRepo,
  type MarkdownFile,
} from "@/lib/markdown/repo-markdown"
import { Shell } from "@/components/layout/shell"

import { FileLink } from "./components/file-link"

export default async function MarkdownPageListPage() {
  try {
    const markdownFiles = await getMarkdownFilesFromRepo(
      "public/globalSolutions/dfda"
    )

    if (!markdownFiles || markdownFiles.length === 0) {
      return (
        <Shell>
          <div className="mx-auto max-w-4xl py-8">
            <h1 className="mb-8 text-3xl font-bold">Documentation</h1>
            <p>No documentation files found.</p>
          </div>
        </Shell>
      )
    }

    return (
      <Shell>
        <div className="mx-auto max-w-4xl py-8">
          <h1 className="mb-8 text-3xl font-bold">Documentation</h1>
          <div className="space-y-4">
            {Object.entries(
              markdownFiles.reduce(
                (acc: Record<string, MarkdownFile[]>, file) => {
                  const dirPath = path.dirname(file.relativePath)
                  if (!acc[dirPath]) {
                    acc[dirPath] = []
                  }
                  acc[dirPath].push(file)
                  return acc
                },
                {}
              )
            ).map(([dirPath, files]) => (
              <div
                key={dirPath}
                className="rounded-lg border border-border p-4"
              >
                <h2 className="mb-3 text-xl font-semibold">
                  {dirPath === "." ? "Root" : dirPath}
                </h2>
                <div className="space-y-2 pl-4">
                  {files.map((file: MarkdownFile) => (
                    <FileLink key={file.path} file={file} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Shell>
    )
  } catch (error) {
    console.error("Error loading documentation:", error)
    return (
      <Shell>
        <div className="mx-auto max-w-4xl py-8">
          <h1 className="mb-8 text-3xl font-bold">Documentation</h1>
          <p className="text-red-500">Error loading documentation files.</p>
        </div>
      </Shell>
    )
  }
}