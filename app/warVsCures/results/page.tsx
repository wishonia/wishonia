import { Metadata } from "next"
import { redirect } from "next/navigation"

import { getAverageWarPercentageDesired } from "@/lib/api/warVsCures"
import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import AfterLoginHandler from "@/components/AfterLoginHandler"
import SpendingOnDiseasesVsMilitary from "@/components/charts/spending-on-diseases-vs-military-chartsjs"
import { Shell } from "@/components/layout/shell"
import WarVsCuresBarChart from "@/components/war-vs-cures-bar-chart"

export const metadata: Metadata = {
  title: "War vs Cures Results",
  description:
    "How much should governments allocate to war/military vs helping people suffering from chronic diseases?",
}

interface DashboardProps {}

export default async function Dashboard({}: DashboardProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/signin")
  }

  const averageWarPercentageDesired = await getAverageWarPercentageDesired()

  return (
    <Shell>
      <AfterLoginHandler></AfterLoginHandler>
      <div
        className="flex flex-col items-center justify-between gap-4 pb-4 text-center"
        style={{ maxWidth: "90%" }}
      >
        <div className="flex flex-col items-center justify-between gap-4 px-2 pb-4 text-center md:flex-row">
          <div className="grid gap-1">
            <h1 className="text-2xl font-bold md:text-3xl">Current Results</h1>
            <p className="text-m text-muted-foreground">
              {`The average person would prefer
                     ${100 - averageWarPercentageDesired}% of our resources be devoted to medical research.`}
            </p>
            <p className="text-m text-muted-foreground">
              {`However, governments currently only allocate 5%.`}
            </p>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ width: "50%", maxWidth: "200px" }}>
            <div className="text-center text-sm font-bold">
              What People Want
            </div>
          </div>
          <div style={{ width: "48%", maxWidth: "200px" }}>
            <p className="text-center text-sm font-bold">Current Allocation</p>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="mr-1 border-2 border-black bg-white p-2 text-black">
            <WarVsCuresBarChart
              warPercentageDesired={averageWarPercentageDesired}
              labelsPosition={"bottom"}
            />
          </div>
          <div className="ml-1 border-2 border-black bg-white p-2 text-black">
            <WarVsCuresBarChart
              warPercentageDesired={95}
              labelsPosition={"bottom"}
            />
          </div>
        </div>
        <div className={"bg-white p-5 text-black"}>
          <SpendingOnDiseasesVsMilitary></SpendingOnDiseasesVsMilitary>
        </div>
      </div>
    </Shell>
  )
}
