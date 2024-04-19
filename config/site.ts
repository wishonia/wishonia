import { SiteConfig } from "@/types"

import { env } from "@/env.mjs"

export const siteConfig: SiteConfig = {
  name: "Wishonia",
  author: "mikepsinn",
  description:
    "Using collective intelligence to maximize median health and happiness.",
  keywords: [
  ],
  url: {
    base: env.NEXT_PUBLIC_APP_URL,
    author: "https://wishonia.love",
  },
  links: {
    github: "https://github.com/wishonia",
  },
  ogImage: `${env.NEXT_PUBLIC_APP_URL}/og.png`,
}
