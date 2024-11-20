import { dfdaNavigation } from "./domains/dfda"
import { wishoniaNavigation } from "./domains/wishonia"
import { DomainNavigation, NavigationConfig } from "./types"

export const navigationConfig: NavigationConfig = {
  "wishonia.love": wishoniaNavigation,
  "dfda.earth": dfdaNavigation,
}

export function getNavigationForDomain(domain: string): DomainNavigation {
  return navigationConfig[domain] || navigationConfig["wishonia.love"]
}
