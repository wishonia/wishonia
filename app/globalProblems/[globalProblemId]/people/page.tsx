import { Metadata } from "next"
import { notFound } from "next/navigation"

import { GlobalProblemPeopleList } from "@/components/globalProblem/GlobalProblemPeopleList"
import { Shell } from "@/components/layout/shell"
import { getGlobalProblem } from "@/lib/api/globalProblems"
import { getCurrentUser } from "@/lib/session"

interface GlobalProblemPeoplePageProps {
  params: { globalProblemId: string }
  searchParams: { q?: string }
}

export async function generateMetadata({
  params,
}: GlobalProblemPeoplePageProps): Promise<Metadata> {
  const globalProblem = await getGlobalProblem(params.globalProblemId)

  return {
    title: `People Working on ${globalProblem?.name || "Problem"}`,
    description: `Discover researchers, experts, and other people working on ${globalProblem?.name}`,
  }
}

export default async function GlobalProblemPeoplePage({
  params,
  searchParams,
}: GlobalProblemPeoplePageProps) {
  const globalProblem = await getGlobalProblem(params.globalProblemId)
  if (!globalProblem) {
    notFound()
  }

  const user = await getCurrentUser()

  return (
    <Shell>
      <GlobalProblemPeopleList 
        globalProblem={globalProblem}
        user={user}
        searchQuery={searchParams.q}
      />
    </Shell>
  )
} 