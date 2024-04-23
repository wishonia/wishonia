import { Metadata } from "next"
import { Shell } from "@/components/layout/shell"
import MarkdownRenderer from "@/components/MarkdownRenderer";

export const metadata: Metadata = {
  title: "Cost of War",
  description: "Detailed economic analysis of the cost of war.",
}
interface DocsProps {
  params: { filename: string }
}

export default async function Docs({ params }: DocsProps) {
  let { filename } = params;
  filename = filename.replace(/\.md$/, '');
  return (
    <MarkdownRenderer url={`/${filename}.md`}/>
  )
}
