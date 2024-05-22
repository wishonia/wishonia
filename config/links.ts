import {Navigation, NavItem} from "@/types"

const dashboardLink: NavItem = {
    title: "Dashboard",
    href: "/dashboard",
    icon: "dashboard",
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



const profileSettingsLink: NavItem = {
    title: "Profile Settings",
    href: "/dashboard/settings",
    icon: "settings",
};

const featuresLink: NavItem = {
    title: "Features",
    href: "/#features",
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
    href: "/wish",
    icon: "star",
    tooltip: "Create a new wish",
    img: "img/wish.png",
};

const yourWishesLink: NavItem = {
    title: "Your Wishes",
    href: "/dashboard/wishingWells",
    icon: "star",
    tooltip: "View your wishes",
    img: "img/wish.png",
}
export const avatarNav: Navigation = {
    data: [
        profileSettingsLink,
        yourWishesLink,
        wishingWellsLink,
        globalProblemsVoteLink,
        createWish
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
        wishingWellsLink,
        wishingWellsResultsLink,
        globalProblemsVoteLink,
        globalProblemsResultsLink,
    ],
}

