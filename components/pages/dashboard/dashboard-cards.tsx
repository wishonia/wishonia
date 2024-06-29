"use client"

import { SearchParams } from "@/types"

import {
  globalProblemsResultsLink,
  globalProblemsVoteLink,
  globalSolutionsResultsLink,
  globalSolutionsVoteLink,
  wishingWellsLink,
  wishingWellsResultsLink,
} from "@/config/links"
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
