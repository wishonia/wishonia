import { redirect } from "next/navigation"

import { GlobalVariableOverview } from "@/components/globalVariables/global-variable-overview"
import { Shell } from "@/components/layout/shell"
import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"

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
}: GlobalVariablePageProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/signin")
  }

  return (
    <Shell>
      <GlobalVariableOverview
        variableId={params.variableId}
      />
    </Shell>
  )
}
