import { Metadata } from "next"

import { Shell } from "@/components/layout/shell"
import { DashboardHeader } from "@/components/pages/dashboard/dashboard-header"
import {GlobalProblemSolutionsList} from "@/components/global-problem-solutions-list";

interface GlobalProblemsProps {}
let heading = `Average Allocations to Each Solution`;
let metaDescription = `Here's the percentage of resources the average person would like to contribute to solving the problem.`;
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
      <DashboardHeader
        heading={heading}
        text={metaDescription}
      >
      </DashboardHeader>
      <GlobalProblemSolutionsList globalProblemId={globalProblemId}></GlobalProblemSolutionsList>
    </Shell>
  )
}
