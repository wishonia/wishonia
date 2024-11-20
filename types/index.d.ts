import { AgentSource } from "@prisma/client"

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

export interface QSource extends AgentSource {
  options: string
  embedding: string
  maxDepth?: number
  maxLinks?: number
  chunkSize: number
  chunkOverlap: number
}


export interface PetitionSignatureEmailProps {
  petitionTitle: string
  petitionId: string
  userId: string
  baseUrl: string
}

export interface PetitionWithDetails {
  id: string
  title: string
  content: string
  status: 'ACTIVE' | 'CLOSED' | 'SUCCESSFUL'
  _count: {
    signatures: number
  }
  statusUpdates: {
    id: string
    content: string
    createdAt: Date
  }[]
  milestones: {
    id: string
    title: string
    description: string
    threshold: number
    reached: boolean
    reachedAt: Date | null
  }[]
}

export interface CivicApiOfficial {
  name: string
  party: string
  phones: string[]
  emails: string[]
  photoUrl: string
  urls: string[]
  channels: Array<{
    type: string
    id: string
  }>
  address: Array<{
    line1: string
    city: string
    state: string
    zip: string
  }>
}

export interface CivicApiOffice {
  name: string
  divisionId: string
  levels: string[]
  roles: string[]
  officialIndices: number[]
}

export interface CivicApiResponse {
  offices: CivicApiOffice[]
  officials: CivicApiOfficial[]
}