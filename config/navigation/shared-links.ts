import { siteConfig } from "../site"

export const commonLinks = {
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
  home: {
    title: siteConfig.name,
    href: "/",
    icon: "home",
  },
  features: {
    title: "Features",
    href: "/#features",
  },
  overview: {
    title: "Overview",
    href: "/#overview",
  },
  profileSettings: {
    title: "Profile Settings",
    href: "/dashboard/settings",
    icon: "settings",
    tooltip: "Update your profile settings",
  },
  dashboard: {
    title: "Dashboard",
    href: "/dashboard",
    icon: "dashboard",
  },
  reportBug: {
    title: "Report Bug",
    href: `${siteConfig.links.github}/issues/new?template=bug_report.yaml`,
    icon: "bug",
    tooltip: "Report a bug or issue",
    external: true,
  },
  requestFeature: {
    title: "Request Feature",
    href: `${siteConfig.links.github}/issues/new?template=feature_request.yaml`,
    icon: "lightbulb",
    tooltip: "Suggest a new feature",
    external: true,
  },
  github: {
    title: "Contribute",
    href: siteConfig.links.github,
    icon: "github",
    tooltip: "Help improve the project on GitHub",
    external: true,
  },
} as const
