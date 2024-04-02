import { SiteConfig } from "@/types"

import { env } from "@/env.mjs"

export const siteConfig: SiteConfig = {
  name: "Wishonia",
  author: "mikepsinn",
  description:
    "Track daily habits and monitor your progress with little effort.",
  keywords: [
  ],
  url: {
    base: env.NEXT_PUBLIC_APP_URL,
    author: "https://redpangilinan.live",
  },
  links: {
    github: "https://github.com/redpangilinan/Wishonia",
  },
  ogImage: `${env.NEXT_PUBLIC_APP_URL}/og.png`,
}
