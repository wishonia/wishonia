import { Suspense } from 'react'
import DocsSidebar from './components/DocsSidebar'
import DocsContent from './components/DocsContent'
import SearchBar from './components/SearchBar'
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import GitHubConnectModal from './components/GitHubConnectModal'
import { authOptions } from '@/lib/auth'
import { checkGithubAccess, getRepoContents, getGithubContent, type RepoContent } from './actions'
import { MenuItem, parseSummaryMd } from './lib/parseSummary'
import MobileHeader from './components/MobileHeader'

interface PageProps {
  params: {
    org: string
    repo: string
  }
}

// Type guard to check if an array is MenuItem[]
function isMenuItems(items: MenuItem[] | RepoContent[]): items is MenuItem[] {
  return items.length === 0 || 'title' in items[0]
}

// Convert RepoContent to MenuItem
function convertToMenuItem(content: RepoContent): MenuItem {
  return {
    title: content.name,
    path: content.path,
    children: content.children?.map(convertToMenuItem)
  }
}

function Sidebar({ menu }: { menu: MenuItem[] | RepoContent[] }) {
  const menuItems = isMenuItems(menu) ? menu : menu.map(convertToMenuItem)
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <SearchBar menu={menuItems} />
      </div>
      <DocsSidebar menu={menuItems} />
    </div>
  )
}

export default async function DocsPage({ params }: PageProps) {
  const { org, repo } = params
  
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect('/signin')
  }

  const { hasAccess, error } = await checkGithubAccess()
  
  if (!hasAccess) {
    console.log('No GitHub access:', error)
    return (
      <div className="flex h-screen bg-background">
        <div className="m-auto text-center">
          <GitHubConnectModal isOpen={true} onClose={() => {}} />
        </div>
      </div>
    )
  }

  try {
    const contents = await getRepoContents(org, repo)
    
    let menu: MenuItem[] = []
    try {
      const summaryContent = await getGithubContent(org, repo, 'SUMMARY.md')
      menu = parseSummaryMd(summaryContent)
    } catch (error) {
      console.error('Error fetching SUMMARY.md:', error)
      try {
        console.log('Trying lowercase summary.md...')
        const summaryContent = await getGithubContent(org, repo, 'summary.md')
        menu = parseSummaryMd(summaryContent)
      } catch (fallbackError) {
        console.error('Error fetching summary.md:', fallbackError)
        console.log('Using directory structure instead')
      }
    }

    const sidebarContent = menu.length ? menu : contents

    return (
      <div className="flex h-screen bg-background">
        {/* Mobile Header */}
        <MobileHeader menu={sidebarContent} />

        {/* Desktop Sidebar */}
        <div className="hidden md:flex w-64 border-r border-border bg-card">
          <Sidebar menu={sidebarContent} />
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto bg-background text-foreground pt-14 md:pt-0">
          <Suspense fallback={<div className="p-4">Loading...</div>}>
            <DocsContent org={org} repo={repo} />
          </Suspense>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error in DocsPage:', error)
    throw error
  }
} 