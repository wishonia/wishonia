import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { GlobalVariableEditForm } from "@/components/globalVariables/global-variable-edit-form"
import { Shell } from "@/components/layout/shell"
import { DashboardHeader } from "@/components/pages/dashboard/dashboard-header"

export const metadata: Metadata = {
  title: "GlobalVariable Settings",
}

interface GlobalVariableEditProps {
  params: { variableId: string }
}

export default async function GlobalVariableEdit({
  params,
}: GlobalVariableEditProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/signin")
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/dfda/variables?variableId=${params.variableId}&includeCharts=0`
  )
  const globalVariables = await response.json()
  const globalVariable = globalVariables[0]

  if (!globalVariable) {
    notFound()
  }

  return (
    <Shell>
      <DashboardHeader
        heading={globalVariable.name + " Settings"}
        text="Modify globalVariable details."
      />
      <div className="grid grid-cols-1 gap-10">
        <GlobalVariableEditForm
          globalVariable={{
            id: globalVariable.id,
            name: globalVariable.name,
            description: globalVariable.description,
          }}
        />
      </div>
    </Shell>
  )
}
