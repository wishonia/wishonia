import { SiteConfig } from "@/types"

import { env } from "@/env.mjs"

export const siteConfig: SiteConfig = {
  name: env.NEXT_PUBLIC_SITE_NAME || "Wishonia",
  author: env.NEXT_PUBLIC_SITE_AUTHOR || "mikepsinn",
  description:
    env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    "Using collective intelligence to maximize median health and happiness.",
  keywords: env.NEXT_PUBLIC_SITE_KEYWORDS
    ? env.NEXT_PUBLIC_SITE_KEYWORDS.split(",")
    : [],
  url: {
    base: env.NEXT_PUBLIC_APP_URL,
    author: env.NEXT_PUBLIC_SITE_AUTHOR || "mikepsinn",
  },
  links: {
    github: "https://github.com/wishonia/wishonia",
  },
  ogImage: env.NEXT_PUBLIC_SITE_OG_IMAGE || `${env.NEXT_PUBLIC_APP_URL}/og.png`,
  defaultHomepage: "/",
  afterLoginPath: "/dashboard",
}
