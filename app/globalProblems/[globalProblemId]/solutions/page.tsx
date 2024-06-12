import { Metadata } from "next"

import { Shell } from "@/components/layout/shell"
import {GlobalProblemSolutionsVoteAndSolutionsList} from "@/components/global-problem-solutions-vote-and-list";

interface GlobalProblemsProps {}
let heading = `Solutions for the problem`;
let metaDescription = `Vote on the best solutions to the problem and see the average results below!`;
export async function generateMetadata({}: GlobalProblemsProps): Promise<Metadata> {
  return {
    title: heading,
    description: metaDescription,
  }
}

interface GlobalProblemSolutionPageProps {
    params: { globalProblemId: string }
}
export default async function GlobalProblemSolutions({
                                                         params,
                                                     }: GlobalProblemSolutionPageProps) {
  const globalProblemId = params.globalProblemId;
    return (
    <Shell>
      <GlobalProblemSolutionsVoteAndSolutionsList globalProblemId={globalProblemId}>
      </GlobalProblemSolutionsVoteAndSolutionsList>
    </Shell>
  )
}
