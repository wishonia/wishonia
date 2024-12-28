import { Metadata } from "next"
import { redirect } from "next/navigation"

import AfterLoginHandler from "@/components/AfterLoginHandler"
import { GlobalProblemsList } from "@/components/global-problems-list"
import { Shell } from "@/components/layout/shell"
import { DashboardCards } from "@/components/pages/dashboard/dashboard-cards"
import { PollRandomGlobalProblems } from "@/components/poll-random-global-problems"
import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "How much everyone thinks we should allocate to solving each global problem",
}

interface DashboardProps {
  searchParams: { from: string; to: string }
}

export default async function Dashboard({ searchParams }: DashboardProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/signin")
  }

  return (
    <Shell>
      <AfterLoginHandler />
      <PollRandomGlobalProblems user={user} />
      <GlobalProblemsList user={user} />
      <DashboardCards searchParams={searchParams} />
    </Shell>
  )
}
