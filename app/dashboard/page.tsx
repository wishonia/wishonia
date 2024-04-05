import { Metadata } from "next"
import { redirect } from "next/navigation"

import { getDashboardData } from "@/lib/api/dashboard"
import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { dateRangeParams } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ActivityList } from "@/components/activity/activity-list"
import { logColumns } from "@/components/activity/logs/logs-columns"
import { LineChartComponent } from "@/components/charts/linechart"
import { PieChartComponent } from "@/components/charts/piechart"
import { DataTable } from "@/components/data-table"
import { DateRangePicker } from "@/components/date-range-picker"
import { Shell } from "@/components/layout/shell"
import { DashboardCards } from "@/components/pages/dashboard/dashboard-cards"
import { DashboardHeader } from "@/components/pages/dashboard/dashboard-header"
import BarChart from "@/components/bar-chart";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Monitor your progress.",
}

interface DashboardProps {
  searchParams: { from: string; to: string }
}

export default async function Dashboard({ searchParams }: DashboardProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/signin")
  }

  const dateRange = dateRangeParams(searchParams)
  const dashboardData = await getDashboardData(user.id, dateRange)


  return (
    <Shell>
        <div className="flex flex-col items-center justify-between gap-4 px-2 pb-4 text-center">
            <div className="flex flex-col items-center justify-between gap-4 px-2 pb-4 text-center md:flex-row">
                <div className="grid gap-1">
                    <h1 className="text-2xl font-bold md:text-3xl">
                        Current Results
                    </h1>
                    <p className="text-m text-muted-foreground">
                        {`The average person would prefer
                     ${100 - dashboardData.averageWarPercentageDesired}% of our resources be devoted to medical research.`}
                    </p>
                    <p className="text-m text-muted-foreground">
                        {`However, governments currently only allocate 5%.`}
                    </p>
                </div>
            </div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <div style={{width: "50%",  maxWidth: '200px'}}>
                    <div className="text-center text-sm font-bold">What People Want</div>
                </div>
                <div style={{width: "48%", maxWidth: '200px'}}>
                    <p className="text-center text-sm font-bold">Current Allocation</p>
                </div>
            </div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <div className="p-2 border-2 border-black mr-1">
                    <BarChart warPercentageDesired={dashboardData.averageWarPercentageDesired}
                              labelsPosition={"bottom"}/>
                </div>
                <div className="p-2 border-2 border-black ml-1">
                    <BarChart warPercentageDesired={95} labelsPosition={"bottom"}/>
                </div>
            </div>
        </div>
    </Shell>
  )
}
