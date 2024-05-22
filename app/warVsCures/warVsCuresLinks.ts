import {Navigation, NavItem} from "@/types";

const warVsCuresResultsLink: NavItem = {
    title: "Results",
    href: "/warVsCures/results",
    icon: "results",
    tooltip: "View the results of the War vs Cures vote",
}

const warVsCuresVoteLink: NavItem = {
    title: "Vote",
    href: "/warVsCures",
    icon: "vote",
    tooltip: "Vote on the allocation of resources between war and cures",
};

const costOfWarLink: NavItem = {
    title: "Cost of War",
    href: "/docs/cost-of-war",
    icon: "skull",
};

const dihLink: NavItem = {
    title: "Decentralized Institutes of Health",
    href: "/docs/decentralized-institutes-of-health",
    icon: "health",
};

const costOfDiseaseLink: NavItem = {
    title: "Cost of Disease",
    href: "/docs/cost-of-disease",
    icon: "disease",
};



const treatyLink: NavItem = {
    title: "The 1% Treaty",
    href: "/docs/1-percent-treaty",
    icon: "peace",
};

export const warVsCuresTopNav: Navigation = {
    data: [
        warVsCuresVoteLink,
        warVsCuresResultsLink
    ],
};

export const warVsCuresNav: Navigation = {
    data: [
        warVsCuresVoteLink,
        warVsCuresResultsLink,
        costOfDiseaseLink,
        costOfWarLink,
        treatyLink,
        dihLink,
        //wishingWellsLink,
        //voterLeaderboardLink,
    ],
}