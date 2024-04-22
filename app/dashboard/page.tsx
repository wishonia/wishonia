import { Metadata } from "next"
import { redirect } from "next/navigation"

import { getDashboardData } from "@/lib/api/dashboard"
import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { dateRangeParams } from "@/lib/utils"
import { Shell } from "@/components/layout/shell"
import BarChart from "@/components/bar-chart";
import SpendingOnDiseasesVsMilitary from "@/components/charts/spending-on-diseases-vs-military-chartsjs";
import AfterLoginHandler from "@/components/AfterLoginHandler"

export const metadata: Metadata = {
  title: "Results",
  description: "What people want and what governments allocate.",
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
        <AfterLoginHandler></AfterLoginHandler>
        <div className="flex flex-col items-center justify-between gap-4 pb-4 text-center"
             style={{ maxWidth: "90%" }}>
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
                <div style={{width: "50%", maxWidth: '200px'}}>
                    <div className="text-center text-sm font-bold">What People Want</div>
                </div>
                <div style={{width: "48%", maxWidth: '200px'}}>
                    <p className="text-center text-sm font-bold">Current Allocation</p>
                </div>
            </div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <div className="p-2 border-2 border-black mr-1 bg-white text-black">
                    <BarChart warPercentageDesired={dashboardData.averageWarPercentageDesired}
                              labelsPosition={"bottom"}/>
                </div>
                <div className="p-2 border-2 border-black ml-1 bg-white text-black">
                    <BarChart warPercentageDesired={95} labelsPosition={"bottom"}/>
                </div>
            </div>
            <div className={"bg-white text-black p-5"}>
                <SpendingOnDiseasesVsMilitary></SpendingOnDiseasesVsMilitary>
            </div>
        </div>
    </Shell>
  )
}
