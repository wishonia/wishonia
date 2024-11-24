import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getGlobalSolution } from "@/lib/api/globalSolutions"
import { Shell } from "@/components/layout/shell"
import MarkdownRenderer from "@/components/markdown/MarkdownRenderer"

interface GlobalSolutionPageProps {
  params: { globalSolutionId: string }
}

export async function generateMetadata({
  params,
}: GlobalSolutionPageProps): Promise<Metadata> {
  const globalSolution = await getGlobalSolution(params.globalSolutionId)

  return {
    title: globalSolution?.name || "Not Found",
    description: globalSolution?.description,
  }
}

export default async function GlobalSolutionPage({
  params,
}: GlobalSolutionPageProps) {
  const globalSolution = await getGlobalSolution(params.globalSolutionId)

  if (!globalSolution) {
    notFound()
  }

  return (
    <Shell>
      <MarkdownRenderer
        name={globalSolution.name}
        featuredImage={globalSolution.featuredImage}
        description={globalSolution.description}
        content={globalSolution.content}
      />
    </Shell>
  )
}
