import { commonLinks } from "../shared-links"
import { DomainNavigation } from "../types"

export const dfdaLinks = {
  dfda: {
    title: "DFDA",
    href: "/dfda",
    icon: "health",
    tooltip: "The Decentralized Food and Drug Administration",
  },
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
  fdai: {
    title: "FDAi",
    href: "https://fdai.earth",
    icon: "robot",
    tooltip: "An autonomous AI Food and Drug Administration",
  },
} as const

export const dfdaNavigation: DomainNavigation = {
  topNav: [
    dfdaLinks.dfda,
    dfdaLinks.clinipedia,
    dfdaLinks.digitalTwinSafe,
    dfdaLinks.fdai,
  ],
  sidebarNav: [
    dfdaLinks.dfda,
    dfdaLinks.clinipedia,
    dfdaLinks.digitalTwinSafe,
    dfdaLinks.fdai,
    commonLinks.docs,
  ],
  avatarNav: [
    commonLinks.profileSettings,
    dfdaLinks.dfda,
    dfdaLinks.clinipedia,
    dfdaLinks.digitalTwinSafe,
    dfdaLinks.fdai,
  ],
  footerNav: [
    dfdaLinks.dfda,
    dfdaLinks.clinipedia,
    dfdaLinks.digitalTwinSafe,
    dfdaLinks.fdai,
    commonLinks.github,
  ],
}
