import { writeFileSync } from "fs"

import { stringify } from "gray-matter"

import { MarkdownFile, MarkdownMeta } from "@/interfaces/markdownFile"
import { pathToUrl, relativePathFromPublic } from "@/lib/fileHelper"
import { generateAndUploadFeaturedImageJpg } from "@/lib/imageGenerator"
import { textCompletion } from "@/lib/llm"

export async function saveMarkdownPost(
  markdownFile: MarkdownFile
): Promise<void> {
  if (markdownFile.featuredImage) {
    markdownFile.featuredImage = relativePathFromPublic(
      markdownFile.featuredImage
    )
  }
  const content = markdownFile.content
  const metadata = getMetaFromMarkdownFile(markdownFile)
  const postContent = stringify(content, metadata)
  writeFileSync(markdownFile.absFilePath, postContent)
  console.log(`Post saved to ${markdownFile.absFilePath}`)
}

const baseMarkdownUrl = "https://wishonia.love/md/"

export function getMetaFromMarkdownFile(
  markdownFile: MarkdownFile
): MarkdownMeta | any {
  const metadata = JSON.parse(JSON.stringify(markdownFile))
  if (!metadata.url) {
    metadata.url = pathToUrl(markdownFile.absFilePath, baseMarkdownUrl)
  }
  delete metadata.absFilePath
  delete metadata.content
  return metadata
}

export async function generateMarkdownAndImageFromDescription(
  postPath: string,
  name: string,
  description: string,
  contentInstructions: string
): Promise<void> {
  let jpgPath = await generateAndUploadFeaturedImageJpg(description, postPath)
  jpgPath = relativePathFromPublic(jpgPath)
  let content = await textCompletion(contentInstructions, "text")
  // if a Markdown code block wrapper with backticks like ```markdown is found,
  // extract the content between the backticks
  content = content.replace(/```markdown\n([\s\S]+?)\n```/g, "$1")
  const post = {
    name: name,
    description: description,
    content: content,
    featuredImage: jpgPath,
    absFilePath: postPath,
  } as MarkdownFile
  return saveMarkdownPost(post)
}
