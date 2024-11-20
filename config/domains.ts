import { z } from "zod"

export const DomainConfig = z.object({
  name: z.string(),
  description: z.string(),
  author: z.string().optional(),
  keywords: z.string().optional(),
  defaultHomepage: z.string(),
  afterLoginPath: z.string(),
  ogImage: z.string().url().optional(),
})

export type DomainConfigType = z.infer<typeof DomainConfig>

export const domainConfigs: Record<string, DomainConfigType> = {
  "wishonia.love": {
    name: "Wishonia",
    description: "Using collective intelligence to maximize median health and happiness.",
    author: "mikepsinn",
    keywords: "collective intelligence, health, happiness",
    defaultHomepage: "/",
    afterLoginPath: "/dashboard",
    ogImage: "https://wishonia.love/og.png"
  },
  "dfda.earth": {
    name: "The Decentralized FDA",
    description: "Crowdsourcing clinical research",
    author: "mikepsinn",
    keywords: "clinical research, health data",
    defaultHomepage: "/dfda",
    afterLoginPath: "/dfda",
    ogImage: "/globalSolutions/dfda/dfda-og.png"
  }
} 