import { Metadata } from "next"
import { Shell } from "@/components/layout/shell"
import {PollRandomGlobalProblemSolutions} from "@/components/poll-random-global-problem-solutions";
import {getCurrentUser} from "@/lib/session";

export const metadata: Metadata = {
  title: "Vote on Solutions",
  description: "Indicate how much you want to allocate to solving the problem",
}

interface GlobalProblemSolutionsVotePageProps {
  searchParams: { thisGlobalProblemSolutionName: string; thatGlobalProblemSolutionName: string }
  params: { globalProblemId: string }
}

export default async function GlobalProblemSolutionsVotePage({ searchParams, params }:
  GlobalProblemSolutionsVotePageProps) {

  const user = await getCurrentUser()
  const globalProblemId = params.globalProblemId

  return (
    <Shell>
        <PollRandomGlobalProblemSolutions 
            globalProblemId={globalProblemId} 
            user={user}>
        </PollRandomGlobalProblemSolutions>
    </Shell>
  )
}
