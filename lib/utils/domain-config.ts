import { headers } from "next/headers"

import { domainConfigs } from "@/config/domains"
import { env } from "@/env.mjs"
import { SiteConfig } from "@/types"


export function getDomainConfig(hostname?: string | null): SiteConfig {
  // Use TEST_DOMAIN from env if set (for local development)
  if (env.TEST_DOMAIN) {
    return domainConfigs[env.TEST_DOMAIN] || domainConfigs["wishonia.love"]
  }

  // If hostname is not provided, try to get it from headers (server-side)
  if (!hostname) {
    try {
      const headersList = headers()
      hostname = headersList.get("host")
      if (!hostname) {
        console.warn("No host header found, falling back to default domain")
      }
    } catch (e) {
      console.error("Failed to access headers:", e)
      return domainConfigs["wishonia.love"]
    }
  }

  // Clean the hostname (remove port and www.)
  const cleanHostname = hostname?.replace(/:\d+$/, "").replace(/^www\./, "")

  if (!cleanHostname) {
    return domainConfigs["wishonia.love"]
  }

  // Check for exact domain match first
  if (domainConfigs[cleanHostname]) {
    return domainConfigs[cleanHostname]
  }

  // Check if the hostname is a subdomain of any configured domain
  const parentDomain = Object.keys(domainConfigs).find((domain) =>
    cleanHostname.endsWith(`.${domain}`)
  )

  return parentDomain
    ? domainConfigs[parentDomain]
    : domainConfigs["wishonia.love"]
}