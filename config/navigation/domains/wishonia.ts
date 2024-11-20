import { commonLinks } from "../shared-links"
import { DomainNavigation } from "../types"

export const wishoniaLinks = {
  dashboard: commonLinks.dashboard,
  // ... Wishonia-specific links
} as const

export const wishoniaNavigation: DomainNavigation = {
  topNav: [
    wishoniaLinks.dashboard,
    // ...
  ],
  sidebarNav: [wishoniaLinks.dashboard, commonLinks.docs],
  avatarNav: [
    wishoniaLinks.dashboard,
    // ...
  ],
  footerNav: [
    commonLinks.github,
    // ...
  ],
}
