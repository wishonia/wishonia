import { Metadata } from "next"

import MarkdownFileRenderer from "@/components/markdown/MarkdownFileRenderer"

export const metadata: Metadata = {
  title: "Docs",
  description: "Info about the Decentralized FDA",
}

interface DocsProps {
  params: { filename: string }
}

export default async function Docs({ params }: DocsProps) {
  let { filename } = params
  console.log("Initial params:", params)

  // implode filename to string if it's an array
  if (Array.isArray(filename)) {
    console.log("Filename is array:", filename)
    filename = filename.join("/")
  }

  // Update the path to point to the correct directory
  const mdPath = `/globalSolutions/dfda/${filename}.md`
  console.log("Final markdown path:", mdPath)

  return <MarkdownFileRenderer url={mdPath} variant="neobrutalist" />
}
