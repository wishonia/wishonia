import { Metadata } from "next"

import { getCurrentUser } from "@/lib/session"
import { Shell } from "@/components/layout/shell"
import { PollRandomGlobalSolutions } from "@/components/poll-random-global-solutions"
import { GlobalSolutionsList } from "@/components/global-solutions-list"

export const metadata: Metadata = {
  title: "Global Problems",
  description: "Indicate how much you want to allocate to solving each problem",
}

interface DashboardProps {
  searchParams: {
    thisGlobalSolutionName: string
    thatGlobalSolutionName: string
  }
}

export default async function GlobalSolutionsPage({
  searchParams,
}: DashboardProps) {
  const user = await getCurrentUser()

  return (
    <Shell>
      <PollRandomGlobalSolutions user={user}></PollRandomGlobalSolutions>
      <GlobalSolutionsList user={user}></GlobalSolutionsList>
    </Shell>
  )
}
