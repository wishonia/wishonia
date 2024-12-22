import { Metadata } from "next"

import { getCurrentUser } from "@/lib/session"
import { GlobalProblemsList } from "@/components/global-problems-list"
import { Shell } from "@/components/layout/shell"
import { PollRandomGlobalProblems } from "@/components/poll-random-global-problems"
import { GlobalProblemBreadcrumbs } from "@/components/globalProblem/GlobalProblemBreadcrumbs"

export const metadata: Metadata = {
  title: "Global Problems",
  description: "Indicate how much you want to allocate to solving each problem",
}

interface DashboardProps {
  searchParams: { thisGlobalProblemName: string; thatGlobalProblemName: string }
}

export default async function GlobalProblemsPage({
  searchParams,
}: DashboardProps) {
  const user = await getCurrentUser()

  return (
    <Shell>
      <GlobalProblemBreadcrumbs />
      <GlobalProblemsList user={user}></GlobalProblemsList>
      <PollRandomGlobalProblems user={user}></PollRandomGlobalProblems>
    </Shell>
  )
}
