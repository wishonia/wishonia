import { Navigation, NavItem } from "@/types"

export const dashboardLink: NavItem = {
  title: "Dashboard",
  href: "/dashboard",
  icon: "dashboard",
}

export const globalProblemsVoteLink: NavItem = {
  title: "Vote on Problems",
  href: "/globalProblems",
  icon: "vote",
  img: "/img/screenshots/problem-allocation-short.png",
  tooltip: "Vote on the allocation of resources between global problems",
}

export const globalProblemsResultsLink: NavItem = {
  title: "Problem Allocations",
  href: "/globalProblems/results",
  icon: "pieChart",
  img: "/img/screenshots/problem-allocation-list.png",
  tooltip: "Percent of resources society wants to allocate to each problem",
}

export const globalSolutionsVoteLink: NavItem = {
  title: "Vote on Solutions",
  href: "/globalSolutions",
  icon: "lightbulb",
  img: "/img/screenshots/problem-allocation-short.png",
  tooltip: "Vote on the allocation of resources between global problems",
}

export const globalSolutionsResultsLink: NavItem = {
  title: "Solutions Allocations",
  href: "/globalSolutions/results",
  icon: "pieChart",
  img: "/img/screenshots/problem-allocation-list.png",
  tooltip: "Percent of resources society wants to allocate to each problem",
}

export const wishingWellsResultsLink: NavItem = {
  title: "Wish Allocations",
  href: "/wishingWells/results",
  icon: "ranking",
  img: "/img/screenshots/wish-allocation-list.png",
  tooltip: "Percent of resources society wants to allocate to each wish",
}

export const wishingWellsLink: NavItem = {
  title: "Vote on Wishes",
  href: "/wishingWells",
  icon: "star",
  img: "/img/screenshots/wish-allocation-short.png",
  tooltip: "Vote on the allocation of resources between society's wishes",
}

export const voterLeaderboardLink: NavItem = {
  title: "Voter Leaderboard",
  href: "/voters",
  icon: "vote",
  tooltip: "View the leaderboard of voters",
}

export const docsLink: NavItem = {
  title: "Docs",
  href: "/docs",
  icon: "docs",
  tooltip: "View the documentation",
}

export const githubLink: NavItem = {
  title: "Github",
  href: "https://github.com/wishonia/wishonia",
  icon: "github",
  tooltip: "Contribute to the project on Github",
  external: true,
}

export const researcherLink: NavItem = {
  title: "Research Agent",
  href: "/researcher",
  icon: "pencil",
  tooltip: "Your very own AI researcher",
}

export const dfdaLink: NavItem = {
  title: "DFDA",
  href: "/dfda",
  icon: "health",
  tooltip: "The Decentralized Food and Drug Administration",
}

export const profileSettingsLink: NavItem = {
  title: "Profile Settings",
  href: "/dashboard/settings",
  icon: "settings",
  tooltip: "Update your profile settings",
}

export const agentsLink: NavItem = {
  title: "Agents",
  href: "/agents",
  icon: "robot",
  tooltip: "Manage your digital slaves",
}

export const featuresLink: NavItem = {
  title: "Features",
  href: "/#features",
}

export const homeLink: NavItem = {
  title: "Home",
  href: "/",
  icon: "home",
}

export const overviewLink: NavItem = {
  title: "Overview",
  href: "/#overview",
}

export const generalDashboardTopNav: Navigation = {
  data: [],
}

let createWish: NavItem = {
  title: "Create Wish",
  href: "/wish",
  icon: "star",
  tooltip: "Create a new wish",
  img: "/img/wish.png",
}

export const yourWishesLink: NavItem = {
  title: "Your Wishes",
  href: "/dashboard/wishingWells",
  icon: "star",
  tooltip: "View your wishes",
  img: "/img/wish.png",
}
export const avatarNav: Navigation = {
  data: [
    profileSettingsLink,
    dashboardLink,
    agentsLink,
    //yourWishesLink,
    //wishingWellsLink,
    //globalProblemsVoteLink,
    //createWish
    researcherLink,
    dfdaLink,
  ],
}

export const landingPageLinks: Navigation = {
  data: [featuresLink, overviewLink],
}

export const generalSidebarNav: Navigation = {
  data: [
    dashboardLink,
    //wishingWellsLink,
    //wishingWellsResultsLink,
    globalProblemsVoteLink,
    //globalProblemsResultsLink,
    globalSolutionsVoteLink,
    //globalSolutionsResultsLink,
    docsLink,
    githubLink,
    researcherLink,
    dfdaLink,
  ],
}

export const generalFooterNav: Navigation = {
  data: [
    //wishingWellsLink,
    //wishingWellsResultsLink,
    globalProblemsVoteLink,
    globalProblemsResultsLink,
    docsLink,
    githubLink,
    researcherLink,
    dfdaLink,
  ],
}
