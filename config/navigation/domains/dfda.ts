import { commonLinks } from "../shared-links"
import { DomainNavigation } from "../types"

export const dfdaLinks = {
  digitalTwinSafe: {
    title: "Digital Twin Safe",
    href: "https://safe.dfda.earth",
    icon: "safe",
    tooltip: "Import, record and analyze your medical data",
  },
  clinipedia: {
    title: "Studies",
    href: "https://studies.dfda.earth",
    icon: "health",
    tooltip: "The Wikipedia of Clinical Research",
  },
  // ... other DFDA-specific links
} as const

export const dfdaNavigation: DomainNavigation = {
  topNav: [dfdaLinks.clinipedia, dfdaLinks.digitalTwinSafe],
  sidebarNav: [
    dfdaLinks.clinipedia,
    dfdaLinks.digitalTwinSafe,
    commonLinks.docs,
  ],
  avatarNav: [dfdaLinks.clinipedia, dfdaLinks.digitalTwinSafe],
  footerNav: [
    dfdaLinks.clinipedia,
    dfdaLinks.digitalTwinSafe,
    commonLinks.github,
  ],
}
