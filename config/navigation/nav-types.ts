import { NavItem } from "@/types"





export interface DomainNavigation {
  topNav: NavItem[]
  sidebarNav: NavItem[]
  avatarNav: NavItem[]
  footerNav: NavItem[]
}

export interface NavigationConfig {
  [domain: string]: DomainNavigation
}
