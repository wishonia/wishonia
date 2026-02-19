import { MetadataRoute } from "next"

import { siteConfig } from "@/config/site"
import { routeTree, RouteNode } from "@/config/routeTree"

// Routes that require authentication or are not useful for search engines
const EXCLUDED_PREFIXES = [
  // Auth pages
  "/auth",
  // User-specific / auth-required
  "/dashboard",
  "/profile",
  "/chat",
  "/agents/mine",
  "/agents/new",
  // Petitions - auth-required actions
  "/petitions/create",
  "/petitions/my-referrals",
  "/petitions/my-signatures",
  // DFDA - auth-required or internal
  "/dfda/inbox",
  "/dfda/userVariables",
  "/dfda/safe",
  "/dfda/measurements/image2measurements",
  "/dfda/measurements/text2measurements",
  "/dfda/drug-companies",
  "/dfda/study/create",
  // Creation/settings pages (auth-required)
  "/globalProblems/new",
  "/globalSolutions/new",
  // Call scheduler - auth-required
  "/call-scheduler/account",
  "/call-scheduler/schedules",
]

function collectStaticRoutes(node: RouteNode): string[] {
  const routes: string[] = []

  // Skip dynamic routes
  if (node.isDynamic) return routes

  // Skip route groups (parenthesized names like "(frontpage)")
  const isRouteGroup = node.name.startsWith("(") && node.name.endsWith(")")

  // Add the route if it's not the root (root is added separately) and not a route group
  if (node.path !== "/" && !isRouteGroup) {
    const excluded = EXCLUDED_PREFIXES.some(
      (prefix) => node.path === prefix || node.path.startsWith(prefix + "/")
    )
    if (!excluded) {
      routes.push(node.path)
    }
  }

  // Recurse into children
  for (const child of Object.values(node.children)) {
    routes.push(...collectStaticRoutes(child))
  }

  return routes
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url.base

  const staticRoutes = collectStaticRoutes(routeTree)

  const entries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ]

  return entries
}
