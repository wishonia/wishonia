import { Metadata } from "next"

import { GlobalProblemsList } from "@/components/global-problems-list"
import { Shell } from "@/components/layout/shell"
import { DashboardHeader } from "@/components/pages/dashboard/dashboard-header"

interface GlobalProblemsProps {}
let heading = `Average Allocations to Each Global Problem`
let metaDescription = `Here's the percentage of societal resources the average person would like to contribute to solving each global problem.`
export async function generateMetadata({}: GlobalProblemsProps): Promise<Metadata> {
  return {
    title: heading,
    description: metaDescription,
  }
}

export default async function GlobalProblems({}: GlobalProblemsProps) {
  return (
    <Shell>
      <DashboardHeader
        heading={heading}
        text={metaDescription}
      ></DashboardHeader>
      <GlobalProblemsList />
    </Shell>
  )
}
