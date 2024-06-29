import { type Author } from "./author"

export type MarkdownFile = {
  slug?: string
  name: string
  date?: string
  featuredImage?: string
  author?: Author
  description?: string
  ogImage?: {
    url: string
  }
  content: string
  preview?: boolean
  absFilePath: string
  url: string
}

export type MarkdownMeta = {
  slug?: string
  name: string
  date?: string
  featuredImage?: string
  author?: Author
  description?: string
  ogImage?: {
    url: string
  }
  preview?: boolean
  url: string
}
