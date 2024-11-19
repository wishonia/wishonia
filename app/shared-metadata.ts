import { siteConfig } from "@/config/site"

export const sharedTitle = siteConfig.name
export const sharedDescription = siteConfig.description
export const sharedImage = {
  width: 1200,
  height: 630,
  type: "image/png",
  url: siteConfig.ogImage,
}
