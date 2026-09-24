import { Navigation } from "@/types"

import { wishoniaLinks, wishoniaNavigation } from "./domains/wishonia-nav"
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
    ],
  } as Navigation,

  sidebarNav: {
    data: wishoniaNavigation.sidebarNav,
  } as Navigation,
}
export const globalProblemsVoteLink = wishoniaLinks.globalProblemsVote
export const generalDashboardTopNav: Navigation = {
  data: [],
}
export const avatarNav = generalNavigation.avatarNav
export const generalFooterNav = wishoniaNavigation.footerNav
export const generalSidebarNav = generalNavigation.sidebarNav
