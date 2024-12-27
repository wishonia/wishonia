import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { Suspense } from "react"

import GlobalBrainNetwork from "@/components/landingPage/global-brain-network";
import { authOptions } from "@/lib/auth"

import {
  checkGithubAccess,
  getGithubContent,
  getRepoContents,
  type RepoContent,
} from "./actions"
import DocsContent from "./components/DocsContent"
import DocsSidebar from "./components/DocsSidebar"
import GitHubConnectModal from "./components/GitHubConnectModal"
import MobileHeader from "./components/MobileHeader"
import { MenuItem, parseSummaryMd } from "./lib/parseSummary"

interface PageProps {
  params: {
    org: string
    repo: string
  }
  searchParams: { [key: string]: string | string[] | undefined }
}

// Type guard to check if an array is MenuItem[]
function isMenuItems(items: MenuItem[] | RepoContent[]): items is MenuItem[] {
  return items.length === 0 || "title" in items[0]
}

// Convert RepoContent to MenuItem
function convertToMenuItem(content: RepoContent): MenuItem {
  return {
    title: content.name,
    path: content.path,
    children: content.children?.map(convertToMenuItem),
  }
}

function Sidebar({ menu }: { menu: MenuItem[] | RepoContent[] }) {
  const menuItems = isMenuItems(menu) ? menu : menu.map(convertToMenuItem)

  return (
    <div className="flex h-full flex-col">

      <DocsSidebar menu={menuItems} />
    </div>
  )
}

function findSummaryFile(contents: RepoContent[]): string | null {
  // Look for SUMMARY.md or summary.md in root level
  const summaryFile = contents.find(
    (item) =>
      item.type === "file" &&
      (item.path.toLowerCase() === "summary.md" ||
        item.path.toLowerCase() === "readme.md")
  )

  return summaryFile ? summaryFile.path : null
}

function findReadmeFile(contents: RepoContent[]): string | null {
  // Look for README.md or readme.md in root level
  const readmeFile = contents.find(
    (item) => item.type === "file" && item.path.toLowerCase() === "readme.md"
  )

  return readmeFile ? readmeFile.path : null
}

export const revalidate = false // Disable automatic revalidation

console.log("Rendering DocsPage:", new Date().toISOString())

export default async function DocsPage({ params, searchParams }: PageProps) {
  const { org, repo } = params

  console.log("Page params:", { org, repo, searchParams })

  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect("/signin")
  }

  const { hasAccess, error } = await checkGithubAccess()

  if (!hasAccess) {
    console.log("No GitHub access:", error)
    return (
      <div className="flex h-screen bg-background">
        <div className="m-auto text-center">
          <GitHubConnectModal isOpen={true} onClose={() => {}} />
        </div>
      </div>
    )
  }

  try {
    // Get the full repository tree first
    const contents = await getRepoContents(org, repo)

    // Initialize menu
    let menu: MenuItem[] = []

    // Check if summary file exists in the tree
    const summaryPath = findSummaryFile(contents)

    if (summaryPath) {
      try {
        // Only fetch the summary content if we found the file
        const summaryContent = await getGithubContent(org, repo, summaryPath)
        menu = parseSummaryMd(summaryContent)
        console.log(`Using ${summaryPath} for navigation`)
      } catch (error) {
        console.error(`Error parsing ${summaryPath}:`, error)
        console.log("Falling back to directory structure")
      }
    } else {
      console.log("No summary file found, using directory structure")
    }

    // Use directory structure if menu is empty
    const sidebarContent = menu.length ? menu : contents

    // Check if we need to redirect to README.md
    const currentFile = searchParams.file
    if (!currentFile) {
      const readmePath = findReadmeFile(contents)
      if (readmePath) {
        redirect(`/docs/${org}/${repo}?file=${readmePath}`)
      }
    }

    return (
      <div className="flex h-screen bg-background">
        {/* Mobile Header */}
        <MobileHeader menu={sidebarContent} />

        {/* Desktop Sidebar */}
        <div className="hidden w-64 border-r border-border bg-card md:flex">
          <Sidebar menu={sidebarContent} />
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto bg-background text-foreground md:pt-0">
          <Suspense fallback={<GlobalBrainNetwork />}>
            <DocsContent org={org} repo={repo} />
          </Suspense>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error in DocsPage:", error)
    throw error
  }
}