import { Navigation } from "@/types"

export const navLinks: Navigation = {
  data: [
    {
      title: "Referendum",
      href: "/",
    },
    // {
    //   title: "Features",
    //   href: "/#features",
    // },
    // {
    //   title: "Overview",
    //   href: "/#overview",
    // },
    {
      title: "Results",
      href: "/dashboard",
    },
  ],
}

export const dashboardLinks: Navigation = {
  data: [
    {
      title: "Results",
      href: "/dashboard",
      icon: "dashboard",
    },
/*    {
      title: "Wishing Wells",
      href: "/dashboard/wishingWells",
      icon: "wishingWell",
    },*/
    {
      title: "Profile Settings",
      href: "/dashboard/settings",
      icon: "settings",
    },
/*    {
      title: "Voter Leaderboard",
      href: "/voters",
      icon: "vote",
    },*/
    {
      title: "Cost of War",
      href: "/docs/cost-of-war",
      icon: "skull",
    },
    {
        title: "Decentralized Institutes of Health",
        href: "/docs/decentralized-institutes-of-health",
        icon: "health",
    }
  ],
}
