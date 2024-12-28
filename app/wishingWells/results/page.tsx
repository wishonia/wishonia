import { Metadata } from "next"

import { Shell } from "@/components/layout/shell"
import { DashboardHeader } from "@/components/pages/dashboard/dashboard-header"
import { WishingWellsList } from "@/components/wishing-well-list"

interface WishingWellsProps {}
const heading = `Average Allocations to Each Wish`
const metaDescription = `Here's the percentage of societal resources the average person would like to contribute to each wish.`
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
       />
      <WishingWellsList />
    </Shell>
  )
}
