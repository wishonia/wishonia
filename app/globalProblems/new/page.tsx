import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

import { GlobalProblemForm } from "@/components/globalProblem/global-problem-form"
import { Shell } from "@/components/layout/shell"
import { DashboardHeader } from "@/components/pages/dashboard/dashboard-header"
import { getGlobalProblem } from "@/lib/api/globalProblems"
import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"

export const metadata: Metadata = {
  title: "What's your problem?",
  description:
    "Enter the name and a detailed description of the problem you are solving.",
}

interface GlobalProblemEditProps {
  params: { globalProblemId: string }
}

export default async function GlobalProblemEdit({
  params,
}: GlobalProblemEditProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/signin")
  }

  const globalProblem = await getGlobalProblem(params.globalProblemId)

  if (!globalProblem) {
    notFound()
  }

  return (
    <Shell>
      <DashboardHeader
        heading="What's your problem?"
        text="Enter the name and a detailed description of the problem you want to solve."
      />
      <div className="grid grid-cols-1 gap-10">
        <GlobalProblemForm />
      </div>
    </Shell>
  )
}
