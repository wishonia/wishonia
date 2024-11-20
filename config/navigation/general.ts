import { Navigation } from "@/types"

import { dfdaLinks } from "./domains/dfda"
import { wishoniaLinks, wishoniaNavigation } from "./domains/wishonia"
import { commonLinks } from "./shared-links"

export const generalNavigation = {
  dashboardTopNav: {
    data: [],
  } as Navigation,

  avatarNav: {
    data: [
      commonLinks.profileSettings,
      commonLinks.dashboard,
      wishoniaLinks.agents,
      wishoniaLinks.researcher,
      dfdaLinks.dfda,
    ],
  } as Navigation,

  sidebarNav: {
    data: [
      commonLinks.dashboard,
      wishoniaLinks.globalProblemsVote,
      wishoniaLinks.globalSolutionsVote,
      commonLinks.docs,
      commonLinks.github,
      wishoniaLinks.researcher,
      dfdaLinks.dfda,
    ],
  } as Navigation,
}
export const globalProblemsVoteLink = wishoniaLinks.globalProblemsVote
export const generalDashboardTopNav: Navigation = {
  data: [],
}
export const avatarNav = generalNavigation.avatarNav
export const generalFooterNav = wishoniaNavigation.footerNav
export const generalSidebarNav = generalNavigation.sidebarNav
