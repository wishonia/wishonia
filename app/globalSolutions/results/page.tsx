import { Metadata } from "next"

import { Shell } from "@/components/layout/shell"
import { DashboardHeader } from "@/components/pages/dashboard/dashboard-header"
import {GlobalSolutionsList} from "@/components/global-solutions-list";

interface GlobalSolutionsProps {}
let heading = `Average Allocations to Each Global Solution`;
let metaDescription = `Here's the percentage of societal resources the average person would like to contribute to each global solution.`;
export async function generateMetadata({}: GlobalSolutionsProps): Promise<Metadata> {
  return {
    title: heading,
    description: metaDescription,
  }
}

export default async function GlobalSolutions({}: GlobalSolutionsProps) {
  return (
    <Shell>
      <DashboardHeader
        heading={heading}
        text={metaDescription}
      >
      </DashboardHeader>
      <GlobalSolutionsList/>
    </Shell>
  )
}
