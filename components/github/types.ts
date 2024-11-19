export interface Organization {
  login: string
  id: number
  avatar_url: string
  description?: string
}

export interface Repository {
  name: string
  id: number
  full_name: string
  description: string
  stargazers_count: number
  forks_count: number
  default_branch: string
  visibility: string
  updated_at: string
}

export interface FileItem {
  name: string
  path: string
  type: string
  download_url?: string
  size?: number
}

export interface ExistingArticle {
  slug: string
  title: string
  source: string
}
