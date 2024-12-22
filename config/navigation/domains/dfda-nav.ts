import { DomainNavigation } from "../nav-types"
import { commonLinks } from "../shared-links"

export const dfdaLinks = {
  dfda: {
    title: "dFDA",
    href: "/dfda",
    icon: "home",
    tooltip: "The Decentralized Food and Drug Administration",
  },
  conditions: {
    title: "Conditions",
    href: "/dfda/conditions",
    icon: "conditions",
    tooltip: "Explore the most common conditions and their most effective treatments",
  },
  treatments: {
    title: "Treatments",
    href: "/dfda/treatments",
    icon: "treatments",
    tooltip: "See the positive and negative effects of treatments",
  },
  search: {
    title: "Search",
    href: "/dfda/search",
    icon: "search",
    tooltip: "Search for the most effective treatments for your condition and more",
  },
  registerDrug: {
    title: "Register Drug",
    href: "/dfda/drug-companies",
    icon: "register-drug",
    tooltip: "Instantly register your drug and start trials today",
  },
  inbox: {
    title: "Inbox",
    href: "/dfda/inbox",
    icon: "inbox",
    tooltip: "Record your diet, treatments, symptoms, and more",
  },
  trials: {
    title: "Trials",
    href: "/dfda/trials",
    icon: "trials",
    tooltip: "Participate in clinical trials and help us find cures",
  },
  userVariables: {
    title: "Your Data",
    href: "/dfda/userVariables",
    icon: "userVariables",
    tooltip: "Explore your data",
  },
  predictorSearch: {
    title: "Predictor Search",
    href: "/dfda/predictor-search",
    icon: "predictorSearch",
    tooltip: "See the factors that most affect your condition",
  },
  measurements: {
    title: "Measurement History",
    href: "/dfda/measurements",
    icon: "measurements",
    tooltip: "See a history of all your diet, treatments, symptom measurements, and more",
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
  cureAccelerationAct: {
    title: "Cure Acceleration Act",
    href: "/dfda/docs/cure-acceleration-act",
    icon: "petition",
    tooltip: "Help us transform healthcare by signing the Cure Acceleration Act",
  },
  healthSavingsSharing: {
    title: "50/50 Health Savings Sharing Program",
    href: "/dfda/docs/health-savings-sharing",
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
  topNav: [
    dfdaLinks.cureAccelerationAct,
    dfdaLinks.digitalTwinSafe, // Important personal tool
    dfdaLinks.clinipedia,      // External knowledge base
  ],
  sidebarNav: [
    dfdaLinks.dfda,            // Home/Overview
    //dfdaLinks.search,          // Primary action
    //dfdaLinks.conditions,      // Core navigation
    //dfdaLinks.treatments,      // Core navigation
    dfdaLinks.trials,          // User participation
    dfdaLinks.userVariables,   // Personal data
    dfdaLinks.measurements,    // Personal tracking
    dfdaLinks.predictorSearch, // Analysis tool
    dfdaLinks.digitalTwinSafe, // Important personal tool
    dfdaLinks.clinipedia,      // Knowledge base
    dfdaLinks.fdai,            // AI tool
    dfdaLinks.cureAccelerationAct,        // Community action
  ],
  avatarNav: [
    dfdaLinks.inbox,           // Personal messages
    dfdaLinks.userVariables,   // Personal data
    dfdaLinks.measurements,    // Personal tracking
    dfdaLinks.digitalTwinSafe, // Personal data safe
    dfdaLinks.trials,          // User participation
    dfdaLinks.dfdaDocs,        // Documentation
  ],
  footerNav: [
    dfdaLinks.dfda,            // Home/Overview
    dfdaLinks.clinipedia,      // Knowledge base
    dfdaLinks.fdai,            // AI tool
    dfdaLinks.cureAccelerationAct,        // Community action
    dfdaLinks.healthSavingsSharing, // Program info
    dfdaLinks.dfdaDocs,        // Documentation
    commonLinks.reportBug,     // Support
    commonLinks.requestFeature, // Support
  ],
}
