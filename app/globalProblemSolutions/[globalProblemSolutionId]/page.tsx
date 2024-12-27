import { Metadata } from "next"
import { notFound } from "next/navigation"

import { Shell } from "@/components/layout/shell"
import MarkdownRenderer from "@/components/markdown/MarkdownRenderer"
import { getGlobalProblemSolutionById } from "@/lib/api/globalProblemSolutions"

interface GlobalProblemSolutionPageProps {
  params: { globalProblemSolutionId: string }
}

export async function generateMetadata({
  params,
}: GlobalProblemSolutionPageProps): Promise<Metadata> {
  const globalProblemSolution = await getGlobalProblemSolutionById(
    params.globalProblemSolutionId
  )

  return {
    title: globalProblemSolution?.name || "Not Found",
    description: globalProblemSolution?.description,
  }
}

export default async function GlobalProblemSolutionPage({
  params,
}: GlobalProblemSolutionPageProps) {
  const globalProblemSolution = await getGlobalProblemSolutionById(
    params.globalProblemSolutionId
  )

  if (!globalProblemSolution) {
    notFound()
  }

  return (
    <Shell>
      <MarkdownRenderer
        name={globalProblemSolution.name}
        featuredImage={globalProblemSolution.featuredImage}
        description={globalProblemSolution.description}
        content={globalProblemSolution.content}
      />
    </Shell>
  )
}
