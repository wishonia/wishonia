import { Metadata } from "next"

import { getCurrentUser } from "@/lib/session"
import { GlobalProblemsList } from "@/components/global-problems-list"
import { Shell } from "@/components/layout/shell"
import { PollRandomGlobalProblems } from "@/components/poll-random-global-problems"

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
      <PollRandomGlobalProblems user={user}></PollRandomGlobalProblems>
      <GlobalProblemsList user={user}></GlobalProblemsList>
    </Shell>
  )
}
