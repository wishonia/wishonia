import { Metadata } from "next"

import { Shell } from "@/components/layout/shell"
import { GlobalProblemSolutionsList } from "@/components/global-problem-solutions-list"

interface GlobalProblemsProps {}
let heading = `Solutions for the problem`
let metaDescription = `Vote on the best solutions to the problem and see the average results below!`
export async function generateMetadata({}: GlobalProblemsProps): Promise<Metadata> {
  return {
    title: heading,
    description: metaDescription,
  }
}

interface GlobalProblemSolutionPageProps {
  params: { globalProblemId: string }
}
export default function GlobalProblemSolutionsPage({
  params,
}: GlobalProblemSolutionPageProps) {
  const globalProblemId = params.globalProblemId
  return (
    <Shell>
      <GlobalProblemSolutionsList
        globalProblemId={globalProblemId}
      ></GlobalProblemSolutionsList>
    </Shell>
  )
}
