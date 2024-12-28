"use client"

import { LinkCard } from "@/components/link-card"
import { globalProblemsResultsLink } from "@/config/navigation/domains/wishonia-nav"
import { globalProblemsVoteLink } from "@/config/navigation/general-nav"
import { SearchParams } from "@/types"


interface DashboardCardsProps {
  searchParams?: SearchParams
}

export function DashboardCards({ searchParams }: DashboardCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/*            <LinkCard navItem={wishingWellsLink}/>
            <LinkCard navItem={wishingWellsResultsLink}/>*/}
      <LinkCard navItem={globalProblemsVoteLink} />
      <LinkCard navItem={globalProblemsResultsLink} />
      {/*<LinkCard navItem={globalSolutionsVoteLink}/>*/}
      {/*<LinkCard navItem={globalSolutionsResultsLink}/>*/}
    </div>
  )
}
