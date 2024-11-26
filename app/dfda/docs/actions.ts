'use server'

import { getMarkdownFilesFromRepo } from "@/lib/markdown/repo-markdown"

export async function getDocumentationFiles() {
  try {
    const files = await getMarkdownFilesFromRepo("public/globalSolutions/dfda")
    const filesWithContent = files?.map(file => ({
      ...file,
      content: file.content || ''
    })) || []
    return { files: filesWithContent }
  } catch (error) {
    console.error("Error loading documentation:", error)
    return { error: "Failed to load documentation" }
  }
} 