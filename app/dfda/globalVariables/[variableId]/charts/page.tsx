import { Metadata } from "next"
import { redirect } from "next/navigation"

import { getGlobalVariable } from "@/app/dfda/dfdaActions"
import { GlobalVariableCharts } from "@/components/globalVariables/global-variable-charts"
import { Shell } from "@/components/layout/shell"
import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"

export const metadata: Metadata = {
  title: "Global Variable Charts",
}

interface GlobalVariableEditProps {
  params: { variableId: string }
}

export default async function GlobalVariableChart({
  params,
}: GlobalVariableEditProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/signin")
  }
  const variableId = parseInt(params.variableId)
  const globalVariable = await getGlobalVariable(variableId)
  return (
    <Shell>
      <div className="grid grid-cols-1 gap-10">
        <GlobalVariableCharts globalVariable={globalVariable} />
      </div>
    </Shell>
  )
}
