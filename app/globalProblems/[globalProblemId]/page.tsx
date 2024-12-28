import { Metadata } from "next"
import { notFound } from "next/navigation"

import GlobalProblemDashboard from "@/components/globalProblem/global-problem-dashboard";
import { Shell } from "@/components/layout/shell"
import { getGlobalProblem } from "@/lib/api/globalProblems"
import { getCurrentUser } from "@/lib/session"
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
