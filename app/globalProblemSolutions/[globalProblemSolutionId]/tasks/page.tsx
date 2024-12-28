import { Metadata } from "next"

import { GlobalTasksList } from "@/components/global-tasks-list"
import { Shell } from "@/components/layout/shell"
import { DashboardHeader } from "@/components/pages/dashboard/dashboard-header"
import { getGlobalProblemSolutionById } from "@/lib/api/globalProblemSolutions"

interface GlobalProblemSolutionTasksPageProps {
  params: { globalProblemSolutionId: string }
}
interface GlobalTasksProps {}
const heading = `Average Allocations to Each Global Solution`
const metaDescription = `Here's the percentage of societal resources the average person would like to contribute to each global solution.`
export async function generateMetadata({
  params,
}: GlobalProblemSolutionTasksPageProps): Promise<Metadata> {
  return {
    title: heading,
    description: metaDescription,
  }
}

export default async function GlobalTasks({
  params,
}: GlobalProblemSolutionTasksPageProps) {
  // Get globalProblemSolutionId from the URL
  const globalProblemSolutionId = params.globalProblemSolutionId
  // Fetch the global solution
  const globalProblemSolution = await getGlobalProblemSolutionById(
    globalProblemSolutionId
  )
  if (!globalProblemSolution) {
    throw new Error("Global problem solution not found")
  }
  const globalSolutionId = globalProblemSolution.globalSolutionId

  return (
    <Shell>
      <DashboardHeader
        heading={heading}
        text={metaDescription}
       />
      <GlobalTasksList globalSolutionId={globalSolutionId} />
    </Shell>
  )
}
