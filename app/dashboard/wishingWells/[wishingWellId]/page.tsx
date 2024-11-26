import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

import { getStatsDashboardData } from "@/lib/api/dashboard"
import { getUserWishingWell } from "@/lib/api/wishingWells"
import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { cn, dateRangeParams } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Heatmap } from "@/components/charts/heatmap"
import { DataTable } from "@/components/data-table"
import { DateRangePicker } from "@/components/date-range-picker"
import { Icons } from "@/components/icons"
import { Shell } from "@/components/layout/shell"
import { DashboardHeader } from "@/components/pages/dashboard/dashboard-header"
import { StatsCards } from "@/components/wishingWell/stats/stats-cards"
import { WishingWellOperations } from "@/components/wishingWell/wishing-well-operations"
import { wishingWellContributionsColumns } from "@/components/wishingWell/wishingWellContributions/wishing-well-contributions-columns"

interface WishingWellPageProps {
  params: { wishingWellId: string }
  searchParams: { from: string; to: string }
}

export async function generateMetadata({
  params,
}: WishingWellPageProps): Promise<Metadata> {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/signin")
  }

  const wishingWell = await getUserWishingWell(params.wishingWellId, user.id)

  return {
    title: wishingWell?.name || "Not Found",
    description: wishingWell?.description,
  }
}

export default async function WishingWellPage({
  params,
  searchParams,
}: WishingWellPageProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/signin")
  }

  const wishingWell = await getUserWishingWell(params.wishingWellId, user.id)

  if (!wishingWell) {
    notFound()
  }

  const dateRange = dateRangeParams(searchParams)
  const dashboardData = await getStatsDashboardData(wishingWell.id, dateRange)

  return (
    <Shell>
      <DashboardHeader
        heading={`${wishingWell.name} Stats`}
        text={wishingWell.description || ""}
      >
        <div className="flex flex-col items-stretch gap-2 md:items-end">
          <DateRangePicker />
          <WishingWellOperations
            wishingWell={{
              id: wishingWell.id,
            }}
          >
            <div
              className={cn(buttonVariants({ variant: "outline" }), "w-full")}
            >
              <Icons.down className="mr-2 h-4 w-4" />
              Actions
            </div>
          </WishingWellOperations>
        </div>
      </DashboardHeader>
      <Heatmap data={dashboardData.wishingWellContributions} params={params} />
      <StatsCards data={dashboardData} searchParams={searchParams} />
      <DataTable
        columns={wishingWellContributionsColumns}
        data={dashboardData.wishingWellContributions}
      >
        Wishing Well Contributions
      </DataTable>
    </Shell>
  )
}
