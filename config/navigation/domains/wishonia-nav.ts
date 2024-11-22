import { DomainNavigation } from "../nav-types"
import { commonLinks } from "../shared-links"

export const wishoniaLinks = {
  dashboard: commonLinks.dashboard,
  globalProblemsVote: {
    title: "Vote on Problems",
    href: "/globalProblems",
    icon: "vote",
    img: "/img/screenshots/problem-allocation-short.png",
    tooltip: "Vote on the allocation of resources between global problems",
  },
  globalProblemsResults: {
    title: "Problem Allocations",
    href: "/globalProblems/results",
    icon: "pieChart",
    img: "/img/screenshots/problem-allocation-list.png",
    tooltip: "Percent of resources society wants to allocate to each problem",
  },
  globalSolutionsVote: {
    title: "Vote on Solutions",
    href: "/globalSolutions",
    icon: "lightbulb",
    img: "/img/screenshots/problem-allocation-short.png",
    tooltip: "Vote on the allocation of resources between global problems",
  },
  globalSolutionsResults: {
    title: "Solutions Allocations",
    href: "/globalSolutions/results",
    icon: "pieChart",
    img: "/img/screenshots/problem-allocation-list.png",
    tooltip: "Percent of resources society wants to allocate to each problem",
  },
  wishingWells: {
    title: "Vote on Wishes",
    href: "/wishingWells",
    icon: "star",
    img: "/img/screenshots/wish-allocation-short.png",
    tooltip: "Vote on the allocation of resources between society's wishes",
  },
  wishingWellsResults: {
    title: "Wish Allocations",
    href: "/wishingWells/results",
    icon: "ranking",
    img: "/img/screenshots/wish-allocation-list.png",
    tooltip: "Percent of resources society wants to allocate to each wish",
  },
  voterLeaderboard: {
    title: "Voter Leaderboard",
    href: "/voters",
    icon: "vote",
    tooltip: "View the leaderboard of voters",
  },
  researcher: {
    title: "Research Agent",
    href: "/researcher",
    icon: "pencil",
    tooltip: "Your very own AI researcher",
  },
  agents: {
    title: "Agents",
    href: "/agents",
    icon: "robot",
    tooltip: "Manage your digital slaves",
  },
  createWish: {
    title: "Create Wish",
    href: "/wish",
    icon: "star",
    tooltip: "Create a new wish",
    img: "/img/wish.png",
  },
  yourWishes: {
    title: "Your Wishes",
    href: "/dashboard/wishingWells",
    icon: "star",
    tooltip: "View your wishes",
    img: "/img/wish.png",
  },
} as const

export const wishoniaNavigation: DomainNavigation = {
  topNav: [
    wishoniaLinks.dashboard,
    wishoniaLinks.globalProblemsVote,
    wishoniaLinks.globalSolutionsVote,
    wishoniaLinks.wishingWells,
  ],
  sidebarNav: [
    wishoniaLinks.dashboard,
    wishoniaLinks.globalProblemsVote,
    wishoniaLinks.globalSolutionsVote,
    wishoniaLinks.researcher,
    commonLinks.docs,
    commonLinks.github,
    commonLinks.reportBug,
    commonLinks.requestFeature,
  ],
  avatarNav: [
    commonLinks.profileSettings,
    wishoniaLinks.dashboard,
    wishoniaLinks.agents,
    wishoniaLinks.researcher,
    commonLinks.reportBug,
    commonLinks.requestFeature,
    commonLinks.github,
  ],
  footerNav: [
    wishoniaLinks.globalProblemsVote,
    wishoniaLinks.globalProblemsResults,
    commonLinks.docs,
    commonLinks.reportBug,
    commonLinks.requestFeature,
    commonLinks.github,
    wishoniaLinks.researcher,
  ],
}
export const globalProblemsResultsLink = wishoniaLinks.globalProblemsResults
