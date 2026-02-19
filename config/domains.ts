import { SiteConfig } from "@/types"

export const domainConfigs: Record<string, SiteConfig> = {
  "wishonia.love": {
    name: "Wishonia",
    description:
      "Using collective intelligence to maximize median health and happiness.",
    author: "mikepsinn",
    keywords: ["collective intelligence", "health", "happiness"],
    defaultHomepage: "/",
    afterLoginPath: "/dashboard",
    ogImage: "https://wishonia.love/og.png",
    url: {
      base: "https://wishonia.love",
      author: "mikepsinn",
    },
    links: {
      github: "https://github.com/wishonia/wishonia",
    },
  },
  "dfda.earth": {
    name: "The Decentralized FDA",
    description: "Crowdsourcing clinical research",
    author: "mikepsinn",
    keywords: ["clinical research", "health data", "desci"],
    defaultHomepage: "/dfda",
    afterLoginPath: "/dfda",
    ogImage: "/globalSolutions/dfda/dfda-og.png",
    url: {
      base: "https://dfda.earth",
      author: "mikepsinn",
    },
    links: {
      github: "https://github.com/wishonia/wishonia",
    },
  },
}