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
    {
      title: "Signatures",
      href: "/dashboard/activities",
      icon: "activity",
    },
    {
      title: "Profile",
      href: "/dashboard/settings",
      icon: "settings",
    },
  ],
}
