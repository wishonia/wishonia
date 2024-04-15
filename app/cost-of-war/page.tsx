import { Metadata } from "next"
import { Shell } from "@/components/layout/shell"
import MarkdownRenderer from "@/components/MarkdownRenderer";

export const metadata: Metadata = {
  title: "Cost of War",
  description: "Detailed economic analysis of the cost of war.",
}

export default async function Dashboard() {
  return (
      <Shell>
          <MarkdownRenderer url="/cost-of-war.md"/>
      </Shell>
  )
}
