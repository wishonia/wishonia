import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getGlobalProblem } from "@/lib/api/globalProblems"
import { Shell } from "@/components/layout/shell"
import MarkdownRenderer from "@/components/MarkdownRenderer";

interface GlobalProblemPageProps {
  params: { globalProblemId: string }
}

export async function generateMetadata({
  params,
}: GlobalProblemPageProps): Promise<Metadata> {

  const globalProblem = await getGlobalProblem(params.globalProblemId)

  return {
    title: globalProblem?.name || "Not Found",
    description: globalProblem?.description,
  }
}

export default async function GlobalProblemPage({
  params,
}: GlobalProblemPageProps) {

  const globalProblem = await getGlobalProblem(params.globalProblemId)

  if (!globalProblem) {
    notFound()
  }

  return (
    <Shell>
      <MarkdownRenderer name={globalProblem.name}
                        featuredImage={globalProblem.featuredImage}
                        description={globalProblem.description}
                        content={globalProblem.content} />
    </Shell>
  )
}
