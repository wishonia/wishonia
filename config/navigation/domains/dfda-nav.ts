import { DomainNavigation } from "../nav-types"
import { commonLinks } from "../shared-links"

export const dfdaLinks = {
  dfda: {
    title: "dFDA",
    href: "/dfda",
    icon: "home",
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
    icon: "studies",
    tooltip: "The Wikipedia of Clinical Research",
  },
  fdai: {
    title: "FDAi",
    href: "https://fdai.earth",
    icon: "robot",
    tooltip: "An autonomous AI Food and Drug Administration",
  },
  petition: {
    title: "Right to Trial Act",
    href: "/dfda/right-to-trial-act",
    icon: "petition",
    tooltip: "Help us transform healthcare by signing the Right to Trial Act",
  },
} as const

export const dfdaNavigation: DomainNavigation = {
  topNav: [dfdaLinks.clinipedia, dfdaLinks.digitalTwinSafe, dfdaLinks.petition],
  sidebarNav: [
    dfdaLinks.dfda,
    dfdaLinks.clinipedia,
    dfdaLinks.digitalTwinSafe,
    dfdaLinks.fdai,
    dfdaLinks.petition,
    commonLinks.contributeOnGithub,
    commonLinks.reportBug,
    commonLinks.requestFeature,
  ],
  avatarNav: [
    dfdaLinks.dfda,
    dfdaLinks.clinipedia,
    dfdaLinks.digitalTwinSafe,
    dfdaLinks.fdai,
    dfdaLinks.petition,
    commonLinks.reportBug,
    commonLinks.requestFeature,
    commonLinks.contributeOnGithub,
  ],
  footerNav: [
    dfdaLinks.dfda,
    dfdaLinks.clinipedia,
    dfdaLinks.digitalTwinSafe,
    dfdaLinks.fdai,
    dfdaLinks.petition,
    commonLinks.reportBug,
    commonLinks.requestFeature,
    commonLinks.contributeOnGithub,
  ],
}
