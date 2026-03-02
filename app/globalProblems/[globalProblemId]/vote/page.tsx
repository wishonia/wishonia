import { Metadata } from "next"

import { Shell } from "@/components/layout/shell"
import { PollRandomGlobalProblemSolutions } from "@/components/poll-random-global-problem-solutions"

export const metadata: Metadata = {
  title: "Vote on Solutions",
  description: "Indicate how much you want to allocate to solving the problem",
}

interface GlobalProblemSolutionsVotePageProps {
  searchParams: {
    thisGlobalProblemSolutionName: string
    thatGlobalProblemSolutionName: string
  }
  params: { globalProblemId: string }
}

export default function GlobalProblemSolutionsVotePage({
  searchParams,
  params,
}: GlobalProblemSolutionsVotePageProps) {
  const globalProblemId = params.globalProblemId

  return (
    <Shell>
      <PollRandomGlobalProblemSolutions
        globalProblemId={globalProblemId}
      ></PollRandomGlobalProblemSolutions>
    </Shell>
  )
}
