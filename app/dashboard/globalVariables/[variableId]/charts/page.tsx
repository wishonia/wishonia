import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { GlobalVariableCharts } from "@/components/globalVariables/global-variable-charts"
import { Shell } from "@/components/layout/shell"

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
  return (
    <Shell>
      <div className="grid grid-cols-1 gap-10">
        <GlobalVariableCharts variableId={variableId} />
      </div>
    </Shell>
  )
}
