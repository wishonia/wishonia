import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { Shell } from "@/components/layout/shell"
import { UserVariableOverview } from "@/components/userVariables/user-variable-overview"

interface UserVariablePageProps {
  params: { variableId: number }
  searchParams: { from: string; to: string }
}

// export async function generateMetadata({
//   params,
// }: UserVariablePageProps): Promise<Metadata> {
//   const user = await getCurrentUser()
//
//   if (!user) {
//     redirect(authOptions?.pages?.signIn || "/signin")
//   }
//   const response = await fetch(`/api/dfda/userVariables?variableId=${params.variableId}&includeCharts=0`);
//   const userVariables = await response.json();
//   const userVariable = userVariables[0];
//
//   return {
//     title: userVariable?.name || "Not Found",
//     description: userVariable?.description,
//   }
// }

export default async function UserVariablePage({
  params,
  searchParams,
}: UserVariablePageProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/signin")
  }

  return (
    <Shell>
      <UserVariableOverview
        variableId={params.variableId}
        user={user}
        measurementsDateRange={{
          from: searchParams.from,
          to: searchParams.to,
        }}
      />
    </Shell>
  )
}
