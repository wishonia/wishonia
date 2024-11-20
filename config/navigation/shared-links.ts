import { siteConfig } from "../site"

export const commonLinks = {
  dashboard: {
    title: "Dashboard",
    href: "/dashboard",
    icon: "dashboard",
  },
  docs: {
    title: "Docs",
    href: "/docs",
    icon: "docs",
    tooltip: "View the documentation",
  },
  github: {
    title: "Github",
    href: siteConfig.links.github,
    icon: "github",
    tooltip: "Contribute to the project on Github",
    external: true,
  },
  // ... other common links
} as const
