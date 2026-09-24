import { SiteConfig } from "@/types"

export const domainConfigs: Record<string, SiteConfig> = {
  "wishonia.love": {
    name: "Wishonia",
    description:
      "Using collective intelligence to maximize median health and happiness.",
    author: {
      name: "Mike P. Sinn",
      url: "https://mikesinn.com",
    },
    keywords: ["collective intelligence", "health", "happiness"],
    defaultHomepage: "/",
    afterLoginPath: "/dashboard",
    ogImage: "https://wishonia.love/og.png",
    url: {
      base: "https://wishonia.love",
    },
    links: {
      github: "https://github.com/wishonia/wishonia",
    },
  },
}