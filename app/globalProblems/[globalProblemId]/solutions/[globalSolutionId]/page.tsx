import type { GlobalProblem, GlobalSolution } from "@prisma/client"
import { Metadata } from "next"
import { notFound } from "next/navigation"

import { GlobalProblemSolutionRenderer } from "@/components/globalProblemSolution/GlobalProblemSolutionRenderer"
import { Shell } from "@/components/layout/shell"
import { getGlobalProblemSolution } from "@/lib/api/globalProblemSolutions"

interface GlobalProblemSolutionPageProps {
  params: {
    globalSolutionId: string
    globalProblemId: string
  }
}

// Define the type that matches what getGlobalProblemSolution returns
interface GlobalProblemSolutionWithRelations {
  id: string
  globalProblemId: string
  globalSolutionId: string
  createdAt: Date
  updatedAt: Date
  content: string | null
  description: string | null
  featuredImage: string | null
  name: string
  averageAllocation: number | null
  globalProblem: GlobalProblem
  globalSolution: GlobalSolution
}

export async function generateMetadata({
  params,
}: GlobalProblemSolutionPageProps): Promise<Metadata> {
  const globalProblemSolution = await getGlobalProblemSolution(
    params.globalProblemId,
    params.globalSolutionId
  )

  return {
    title: globalProblemSolution?.name || "Not Found",
    description: globalProblemSolution?.description,
  }
}

export default async function GlobalProblemSolutionPage({
  params,
}: GlobalProblemSolutionPageProps) {
  const globalProblemSolution = await getGlobalProblemSolution(
    params.globalProblemId,
    params.globalSolutionId
  ) as GlobalProblemSolutionWithRelations | null

  if (!globalProblemSolution) {
    notFound()
  }

  return (
    <Shell>
      <GlobalProblemSolutionRenderer 
        globalProblemSolution={globalProblemSolution}
      />
    </Shell>
  )
}
