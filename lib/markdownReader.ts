import fs from "fs"
import path from "path"
import { MarkdownFile } from "@/interfaces/markdownFile"
import matter from "gray-matter"

import {
  absPathFromPublic,
  getNonIgnoredFiles,
  pathToMarkdownUrl,
} from "@/lib/fileHelper"

export function listMarkdownFiles(absFolderPath?: string): string[] {
  if (!absFolderPath) {
    absFolderPath = absPathFromPublic("")
  }
  const allFiles = getNonIgnoredFiles(absFolderPath)
  return allFiles.filter((file) => file.endsWith(".md"))
}

export async function readAllMarkdownFiles(
  absFolderPath?: string
): Promise<MarkdownFile[]> {
  const markdownFiles = listMarkdownFiles(absFolderPath)
  return markdownFiles.map((fullPath) => {
    const fileContents = fs.readFileSync(fullPath, "utf8")
    const { data, content } = matter(fileContents)
    // get filename without an extension
    const slug = path.basename(fullPath).replace(/\.md$/, "")
    const markdownFile: MarkdownFile = {
      slug: slug,
      name: data.name,
      date: data.date,
      featuredImage: data.featuredImage,
      author: data.author,
      description: data.description,
      ogImage: data.ogImage,
      content: content,
      preview: data.preview,
      absFilePath: fullPath,
      url: pathToMarkdownUrl(fullPath),
    }

    return markdownFile
  })
}

export async function getMarkdownFilesWithoutMetaData(
  absFolderPath?: string
): Promise<MarkdownFile[]> {
  const allFiles = getNonIgnoredFiles(absFolderPath)
  const mdFilePaths = allFiles.filter((file) => file.endsWith(".md"))
  const mdFilesWithoutMetaData = []
  for (const mdFilePath of mdFilePaths) {
    const fileContents = fs.readFileSync(mdFilePath, "utf8")
    const { data } = matter(fileContents)
    if (!data.name) {
      const markdownFile: MarkdownFile = {
        content: fileContents,
        absFilePath: mdFilePath,
        name: data.name,
        url: pathToMarkdownUrl(mdFilePath),
      }
      mdFilesWithoutMetaData.push(markdownFile)
    }
  }
  const filenames = mdFilesWithoutMetaData.map((mdFile) => mdFile.absFilePath)
  console.log(`Files without metadata: ${filenames.join("\n\t- ")} `)
  return mdFilesWithoutMetaData
}
