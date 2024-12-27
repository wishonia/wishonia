import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getGlobalProblem } from "@/lib/api/globalProblems"
import { getCurrentUser } from "@/lib/session"
import { Shell } from "@/components/layout/shell"
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
      <GlobalProblemDashboard globalProblem={globalProblem} user={user} />


      
    </Shell>
  )
}
