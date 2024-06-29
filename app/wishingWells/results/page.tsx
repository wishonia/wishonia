import { Metadata } from "next"

import { Shell } from "@/components/layout/shell"
import { DashboardHeader } from "@/components/pages/dashboard/dashboard-header"
import { WishingWellsList } from "@/components/wishing-well-list"

interface WishingWellsProps {}
let heading = `Average Allocations to Each Wish`
let metaDescription = `Here's the percentage of societal resources the average person would like to contribute to each wish.`
export async function generateMetadata({}: WishingWellsProps): Promise<Metadata> {
  return {
    title: heading,
    description: metaDescription,
  }
}

export default async function WishingWells({}: WishingWellsProps) {
  return (
    <Shell>
      <DashboardHeader
        heading={heading}
        text={metaDescription}
      ></DashboardHeader>
      <WishingWellsList />
    </Shell>
  )
}
