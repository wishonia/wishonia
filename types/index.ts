import type { Metadata } from "next"

import type { IconKeys } from "@/components/icons"

export type SiteConfig = Metadata & {
  name: string
  author: {
    name: string
    url: string
  }
  description: string
  keywords: Array<string>
  url: {
    base: string
  }
  links: {
    github: string
  }
  ogImage: string
  defaultHomepage: string
  afterLoginPath: string
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
