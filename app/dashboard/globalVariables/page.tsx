import { Metadata } from "next"
import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { GenericVariableAddButton } from "@/components/genericVariables/generic-variable-add-button"
import { Shell } from "@/components/layout/shell"
import { DashboardHeader } from "@/components/pages/dashboard/dashboard-header"
import {GlobalVariableSearch} from "@/components/globalVariables/global-variable-search";


export const metadata: Metadata = {
  title: "Search for a Variable",
  description: "Find a food, drug, symptom, or other variable.",
}

export default async function GlobalVariablesPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/signin")
  }

  return (
    <Shell>
      <DashboardHeader heading="Global Variables" text="Search for a food, drug, symptom or anything else.">
      </DashboardHeader>
      <GlobalVariableSearch user={user} />
    </Shell>
  )
}
