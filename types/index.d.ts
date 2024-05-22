import { IconKeys } from "@/components/icons"

export type SiteConfig = {
  name: string
  author: string
  description: string
  keywords: Array<string>
  url: {
    base: string
    author: string
  }
  links: {
    github: string
  }
  ogImage: string
}

export type NavItem = {
  title: string
  tooltip?: string
  disabled?: boolean
  external?: boolean
  img?: string
  icon?: IconKeys
  href: string
}


export type Navigation = {
  data: NavItem[]
}

export type DateRange = {
  from: Date
  to: Date
}

export type SearchParams = {
  from: string
  to: string
}

export type WishingWellEntry = {
  name: string
  count: number | null
}

export type WishingWellByDate = {
  date: string
  count: number
}