import {Navigation, NavItem} from "@/types"

export const dashboardLink: NavItem = {
    title: "Dashboard",
    href: "/dashboard",
    icon: "dashboard",
};

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
    tooltip: "Percent of resources society wants to allocate to each problem"
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
};

export const voterLeaderboardLink: NavItem = {
    title: "Voter Leaderboard",
    href: "/voters",
    icon: "vote",
    tooltip: "View the leaderboard of voters",
};


export const profileSettingsLink: NavItem = {
    title: "Profile Settings",
    href: "/dashboard/settings",
    icon: "settings",
    tooltip: "Update your profile settings",
};

export const featuresLink: NavItem = {
    title: "Features",
    href: "/#features",
};


export const homeLink: NavItem = {
    title: "Home",
    href: "/",
    icon: "home",
};

export const overviewLink: NavItem = {
    title: "Overview",
    href: "/#overview",
};

export const generalDashboardTopNav: Navigation = {
    data: [],
};

let createWish: NavItem = {
    title: "Create Wish",
    href: "/wish",
    icon: "star",
    tooltip: "Create a new wish",
    img: "/img/wish.png",
};

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
        //yourWishesLink,
        //wishingWellsLink,
        //globalProblemsVoteLink,
        //createWish
    ],
};

export const landingPageLinks: Navigation = {
    data: [
        featuresLink,
        overviewLink
    ],
};


export const generalSidebarNav: Navigation = {
    data: [
        dashboardLink,
        //wishingWellsLink,
        //wishingWellsResultsLink,
        globalProblemsVoteLink,
        globalProblemsResultsLink,
    ],
}


export const generalFooterNav: Navigation = {
    data: [
        //wishingWellsLink,
        //wishingWellsResultsLink,
        globalProblemsVoteLink,
        globalProblemsResultsLink,
    ],
};