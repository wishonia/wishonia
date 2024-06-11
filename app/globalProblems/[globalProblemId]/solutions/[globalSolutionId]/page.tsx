import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getGlobalProblemSolution } from "@/lib/api/globalProblemSolutions"
import { Shell } from "@/components/layout/shell"
import MarkdownRenderer from "@/components/MarkdownRenderer";

interface GlobalProblemSolutionPageProps {
  params: {
    globalSolutionId: string,
    globalProblemId: string,
  }
}

export async function generateMetadata({
  params,
}: GlobalProblemSolutionPageProps): Promise<Metadata> {

  const globalProblemSolution = await getGlobalProblemSolution(
      params.globalProblemId, params.globalSolutionId);

  return {
    title: globalProblemSolution?.name || "Not Found",
    description: globalProblemSolution?.description,
  }
}

export default async function GlobalProblemSolutionPage({
  params,
}: GlobalProblemSolutionPageProps) {

  const globalProblemSolution =
      await getGlobalProblemSolution(
          params.globalProblemId,
          params.globalSolutionId);

  if (!globalProblemSolution) {
    notFound()
  }

  return (
    <Shell>
      <MarkdownRenderer name={globalProblemSolution.name}
                        featuredImage={globalProblemSolution.featuredImage}
                        description={globalProblemSolution.description}
                        content={globalProblemSolution.content} />
    </Shell>
  )
}
