import { Metadata } from "next"
import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { GenericVariableAddButton } from "@/components/genericVariables/generic-variable-add-button"
import { GenericVariableList } from "@/components/genericVariables/generic-variable-list"
import { Shell } from "@/components/layout/shell"
import { DashboardHeader } from "@/components/pages/dashboard/dashboard-header"
import { UserVariableSearch } from "@/components/userVariables/user-variable-search"

export const metadata: Metadata = {
  title: "Your Variables",
  description: "Manage your treatments, symptoms, and other variables.",
}

export default async function UserVariablesPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/signin")
  }

  // Define search parameters
  const searchParams = {
    includePublic: false,
    sort: "-updatedAt",
    limit: 10,
    offset: 0,
    searchPhrase: "",
  }

  return (
    <Shell>
      <DashboardHeader
        heading="Your Variables"
        text="Manage your treatments, symptoms, and other variables."
      >
        <GenericVariableAddButton />
      </DashboardHeader>
      <UserVariableSearch user={user} />
    </Shell>
  )
}
