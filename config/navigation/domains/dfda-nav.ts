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
    href: "/dfda/safe/redirect",
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
    title: "Cure Acceleration Act",
    href: "/dfda/cure-acceleration-act",
    icon: "petition",
    tooltip: "Help us transform healthcare by signing the Cure Acceleration Act",
  },
  healthSavingsSharing: {
    title: "50/50 Health Savings Sharing Program",
    href: "/dfda/health-savings-sharing",
    icon: "savings",
    tooltip:
      "Incentivizing Cures With 50% of Long Term Healthcare Savings from Curative or Preventative Treatments",
  },
  dfdaDocs: {
    title: "Docs",
    href: "/dfda/docs",
    icon: "book",
    tooltip: "Documentation for the Decentralized FDA",
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
    dfdaLinks.healthSavingsSharing,
    commonLinks.contributeOnGithub,
    commonLinks.reportBug,
    commonLinks.requestFeature,
    dfdaLinks.dfdaDocs,
  ],
  avatarNav: [
    dfdaLinks.dfda,
    dfdaLinks.clinipedia,
    dfdaLinks.digitalTwinSafe,
    dfdaLinks.fdai,
    dfdaLinks.petition,
    dfdaLinks.healthSavingsSharing,
    commonLinks.reportBug,
    commonLinks.requestFeature,
    commonLinks.contributeOnGithub,
    dfdaLinks.dfdaDocs,
  ],
  footerNav: [
    dfdaLinks.dfda,
    dfdaLinks.clinipedia,
    dfdaLinks.digitalTwinSafe,
    dfdaLinks.fdai,
    dfdaLinks.petition,
    dfdaLinks.healthSavingsSharing,
    commonLinks.reportBug,
    commonLinks.requestFeature,
    commonLinks.contributeOnGithub,
    dfdaLinks.dfdaDocs,
  ],
}
