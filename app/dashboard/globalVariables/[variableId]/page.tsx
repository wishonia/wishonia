import { Metadata } from "next"
import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { Shell } from "@/components/layout/shell"
import { GlobalVariableOverview } from "@/components/globalVariables/global-variable-overview";


interface GlobalVariablePageProps {
  params: { variableId: number }
  searchParams: { from: string; to: string }
}

// export async function generateMetadata({
//   params,
// }: GlobalVariablePageProps): Promise<Metadata> {
//   const user = await getCurrentUser()
//
//   if (!user) {
//     redirect(authOptions?.pages?.signIn || "/signin")
//   }
//   const response = await fetch(`/api/dfda/variables?variableId=${params.variableId}&includeCharts=0`);
//   const globalVariables = await response.json();
//   const globalVariable = globalVariables[0];
//
//   return {
//     title: globalVariable?.name || "Not Found",
//     description: globalVariable?.description,
//   }
// }

export default async function GlobalVariablePage({
  params,
  searchParams,
}: GlobalVariablePageProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/signin")
  }

  return (
    <Shell>
      <GlobalVariableOverview variableId={params.variableId} user={user} measurementsDateRange={{
        from: searchParams.from,
        to: searchParams.to
      }} />
    </Shell>
  )
}
