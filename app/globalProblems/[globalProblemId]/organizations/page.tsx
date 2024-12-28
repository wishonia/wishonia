import { Metadata } from "next"
import { notFound } from "next/navigation"

import { GlobalProblemOrganizationsList } from "@/components/globalProblem/GlobalProblemOrganizationsList"
import { Shell } from "@/components/layout/shell"
import { getGlobalProblem } from "@/lib/api/globalProblems"
import { getCurrentUser } from "@/lib/session"

interface GlobalProblemOrganizationsPageProps {
  params: { globalProblemId: string }
  searchParams: { q?: string }
}

export async function generateMetadata({
  params,
}: GlobalProblemOrganizationsPageProps): Promise<Metadata> {
  const globalProblem = await getGlobalProblem(params.globalProblemId)

  return {
    title: `Organizations Working on ${globalProblem?.name || "Problem"}`,
    description: `Discover organizations and companies working on ${globalProblem?.name}`,
  }
}

export default async function GlobalProblemOrganizationsPage({
  params,
  searchParams,
}: GlobalProblemOrganizationsPageProps) {
  const globalProblem = await getGlobalProblem(params.globalProblemId)
  if (!globalProblem) {
    notFound()
  }

  const user = await getCurrentUser()

  return (
    <Shell>
      <GlobalProblemOrganizationsList 
        globalProblem={globalProblem}
        user={user}
        searchQuery={searchParams.q}
      />
    </Shell>
  )
} 