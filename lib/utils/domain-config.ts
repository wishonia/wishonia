import { headers } from "next/headers"

import { env } from "@/env.mjs"
import { domainConfigs, DomainConfigType } from "@/config/domains"

export function getDomainConfig(hostname?: string | null): DomainConfigType {
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

  // Return config for domain or default to wishonia.love config
  return domainConfigs[cleanHostname || ""] || domainConfigs["wishonia.love"]
}