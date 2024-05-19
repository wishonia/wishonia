import {Navigation, NavItem} from "@/types"

const warVsCuresVoteLink: NavItem = {
  title: "Vote",
  href: "/warVsCures",
  icon: "vote",
  tooltip: "Vote on the allocation of resources between war and cures",
};

const warVsCuresResultsLink: NavItem = {
    title: "Results",
    href: "/warVsCures/results",
    icon: "results",
    tooltip: "View the results of the War vs Cures vote",
}

const dashboardLink: NavItem = {
  title: "Dashboard",
  href: "/dashboard",
  icon: "results",
};

const treatyLink: NavItem = {
  title: "The 1% Treaty",
  href: "/docs/1-percent-treaty",
  icon: "peace",
};

const costOfWarLink: NavItem = {
  title: "Cost of War",
  href: "/docs/cost-of-war",
  icon: "skull",
};

const globalProblemsVoteLink: NavItem = {
    title: "Prioritize Problems",
    href: "/globalProblems",
    icon: "frown",
}

const globalProblemsResultsLink: NavItem = {
  title: "Problem Prioritization Results",
  href: "/globalProblems/results",
  icon: "pieChart",
}

const wishingWellsResultsLink: NavItem = {
    title: "Society's Wishes",
    href: "/wishingWells/results",
    icon: "ranking",
}

const wishingWellsLink: NavItem = {
  title: "Prioritize Wishes",
  href: "/wishingWells",
  icon: "star",
};

const voterLeaderboardLink: NavItem = {
  title: "Voter Leaderboard",
  href: "/voters",
  icon: "vote",
};

const dihLink: NavItem = {
  title: "Decentralized Institutes of Health",
  href: "/docs/decentralized-institutes-of-health",
  icon: "health",
};

const profileSettingsLink: NavItem = {
  title: "Profile Settings",
  href: "/dashboard/settings",
  icon: "settings",
};

const featuresLink: NavItem = {
  title: "Features",
  href: "/#features",
};

const costOfDiseaseLink: NavItem = {
    title: "Cost of Disease",
    href: "/docs/cost-of-disease",
    icon: "disease",
};

const homeLink: NavItem = {
    title: "Home",
    href: "/",
    icon: "home",
};

const overviewLink: NavItem = {
  title: "Overview",
  href: "/#overview",
};

export const generalDashboardTopNav: Navigation = {
    data: [
       // warVsCuresVoteLink,
        //dashboardLink
    ],
};

export const warVsCuresTopNav: Navigation = {
    data: [
        warVsCuresVoteLink,
        warVsCuresResultsLink
    ],
};

export const generalFooterNav: Navigation = {
  data: [
      wishingWellsLink,
      wishingWellsResultsLink,
      globalProblemsVoteLink,
      globalProblemsResultsLink,
  ],
};

let createWish: NavItem = {
    title: "Create Wish",
    href: "/dashboard/wishingWells",
    icon: "star",
};
export const avatarNav: Navigation = {
  data: [
    profileSettingsLink,
    wishingWellsLink,
    globalProblemsVoteLink,
      {
          title: "War vs Cures",
          href: "/warVsCures",
          icon: "vote",
      },
      createWish
  ],
};

export const landingPageLinks: Navigation = {
  data: [
    featuresLink,
    overviewLink
  ],
};

export const warVsCuresNav: Navigation = {
  data: [
      warVsCuresVoteLink,
      warVsCuresResultsLink,
    costOfDiseaseLink,
    costOfWarLink,
    dashboardLink,
    treatyLink,
    dihLink,
    //wishingWellsLink,
    //voterLeaderboardLink,
  ],
}

export const generalSidebarNav: Navigation = {
  data: [
    wishingWellsLink,
    wishingWellsResultsLink,
    globalProblemsVoteLink,
    globalProblemsResultsLink,
  ],
}

