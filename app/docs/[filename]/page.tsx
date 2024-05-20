import { Metadata } from "next"
import MarkdownFileRenderer from "@/components/MarkdownFileRenderer";

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
    <MarkdownFileRenderer url={`/${filename}.md`}/>
  )
}
