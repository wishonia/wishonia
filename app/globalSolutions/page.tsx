import { Metadata } from "next"
import { Shell } from "@/components/layout/shell"
import {PollRandomGlobalSolutions} from "@/components/poll-random-global-solutions";
import {getCurrentUser} from "@/lib/session";

export const metadata: Metadata = {
  title: "Global Problems",
  description: "Indicate how much you want to allocate to solving each problem",
}

interface DashboardProps {
  searchParams: { thisGlobalSolutionName: string; thatGlobalSolutionName: string }
}

export default async function GlobalSolutionsPage({ searchParams }: DashboardProps) {

  const user = await getCurrentUser()

  return (
    <Shell>
        <PollRandomGlobalSolutions user={user}></PollRandomGlobalSolutions>
    </Shell>
  )
}
