"use client"

import { SearchParams } from "@/types"

import { globalProblemsResultsLink } from "@/config/navigation/domains/wishonia"
import { globalProblemsVoteLink } from "@/config/navigation/general"
import { LinkCard } from "@/components/link-card"

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
