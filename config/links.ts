import {Navigation, NavItem} from "@/types"

const referendumLink: NavItem = {
  title: "Referendum",
  href: "/",
  icon: "vote",
};

const resultsLink: NavItem = {
  title: "Results",
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

const wishingWellsLink: NavItem = {
  title: "Wishing Wells",
  href: "/dashboard/wishingWells",
  icon: "wishingWell",
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

const overviewLink: NavItem = {
  title: "Overview",
  href: "/#overview",
};

export const dashboardTopLinks: Navigation = {
  data: [
    referendumLink,
    resultsLink
  ],
};


export const footerLinks: Navigation = {
  data: [
    costOfDiseaseLink,
    costOfWarLink,
    treatyLink,
    dihLink,
  ],
};

let createWish: NavItem = {
    title: "Create Wish",
    href: "/dashboard/wishingWells",
    icon: "star",

};
export const avatarMenuLinks: Navigation = {
  data: [
    profileSettingsLink,
    referendumLink,
    resultsLink,
    //createWish,
  ],
};

export const landingPageLinks: Navigation = {
  data: [featuresLink, overviewLink],
};

export const leftLinks: Navigation = {
  data: [
    costOfDiseaseLink,
    costOfWarLink,
    resultsLink,
    treatyLink,
    dihLink,
    //wishingWellsLink,
    //voterLeaderboardLink,
  ],
}

