import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { Shell } from "@/components/layout/shell"
import { DashboardHeader } from "@/components/pages/dashboard/dashboard-header"
import { UserVariableCharts } from '@/components/userVariables/user-variable-charts';

export const metadata: Metadata = {
  title: "UserVariable Charts",
}

interface UserVariableEditProps {
  params: { variableId: string }
}

export default async function UserVariableChart({ params }: UserVariableEditProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/signin")
  }
  const variableId = parseInt(params.variableId)
  return (
    <Shell>
      <div className="grid grid-cols-1 gap-10">
        <UserVariableCharts
          variableId={variableId}
        />
      </div>
    </Shell>
  )
}
