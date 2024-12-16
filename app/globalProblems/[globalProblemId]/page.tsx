import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getGlobalProblem } from "@/lib/api/globalProblems"
import { getCurrentUser } from "@/lib/session"
import { GlobalProblemSolutionsList } from "@/components/global-problem-solutions-list"
import { Shell } from "@/components/layout/shell"
import { GlobalProblemRenderer } from "@/components/globalProblem/GlobalProblemRenderer"
import { PollRandomGlobalProblemSolutions } from "@/components/poll-random-global-problem-solutions"
import GlobalProblemDashboard from "@/components/globalProblem/global-problem-dashboard";
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
  const user = await getCurrentUser()

  return (
    <Shell>
      <GlobalProblemDashboard globalProblem={globalProblem} />
      <PollRandomGlobalProblemSolutions
        globalProblemId={globalProblem.id}
        user={user}
      />
      <GlobalProblemRenderer globalProblem={globalProblem} />
      
    </Shell>
  )
}
