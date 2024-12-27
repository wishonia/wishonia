import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

import { GlobalSolutionForm } from "@/components/globalSolution/global-solution-form"
import { Shell } from "@/components/layout/shell"
import { DashboardHeader } from "@/components/pages/dashboard/dashboard-header"
import { getGlobalSolution } from "@/lib/api/globalSolutions"
import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"

export const metadata: Metadata = {
  title: "Global Solution Settings",
}

interface GlobalSolutionEditProps {
  params: { globalSolutionId: string }
}

export default async function GlobalSolutionEdit({
  params,
}: GlobalSolutionEditProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/signin")
  }

  const globalSolution = await getGlobalSolution(params.globalSolutionId)

  if (!globalSolution) {
    notFound()
  }

  return (
    <Shell>
      <DashboardHeader
        heading="Global Solution Settings"
        text="Enter the name and a detailed description of your solution. "
      />
      <div className="grid grid-cols-1 gap-10">
        <GlobalSolutionForm />
      </div>
    </Shell>
  )
}
