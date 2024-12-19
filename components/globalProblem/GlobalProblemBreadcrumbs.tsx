"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home, Menu } from "lucide-react"
import { GlobalProblem } from "@prisma/client"

import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

interface GlobalProblemBreadcrumbsProps {
  globalProblem?: GlobalProblem | undefined
}

interface NavigationItem {
  label: string
  emoji: string
  description: string
}

type NavigationItems = {
  [K in 'overview' | 'people' | 'organizations' | 'solutions' | 'vote']: NavigationItem
}

const navigationItems: NavigationItems = {
  overview: {
    label: "Overview",
    emoji: "📊",
    description: "View key statistics and summary of the problem"
  },
  people: {
    label: "People",
    emoji: "👥",
    description: "Discover experts and researchers working on this problem"
  },
  organizations: {
    label: "Organizations",
    emoji: "🏢",
    description: "See organizations and companies working this problem"
  },
  solutions: {
    label: "All Solutions",
    emoji: "💡",
    description: "Explore proposed solutions and their estimated effectiveness"
  },
  vote: {
    label: "Vote on Solutions",
    emoji: "🗳️",
    description: "Compare and indicate which solutions you think are most effective"
  }
}

export function GlobalProblemBreadcrumbs({ globalProblem }: GlobalProblemBreadcrumbsProps) {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)
  const isGlobalProblemPage = segments.includes("globalProblems")
  const currentSubpage = segments[segments.length - 1]
  
  if (!isGlobalProblemPage) return null

  const SubpageDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="p-0 h-auto font-normal hover:bg-transparent text-foreground"
        >
          <span className="flex items-center">
            {navigationItems[currentSubpage as keyof NavigationItems]?.emoji}{" "}
            {navigationItems[currentSubpage as keyof NavigationItems]?.label}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {(Object.entries(navigationItems) as Array<[keyof NavigationItems, NavigationItem]>)
          .filter(([key]) => key !== currentSubpage)
          .map(([key, item]) => (
            <DropdownMenuItem key={key} asChild>
              <Link 
                href={`/globalProblems/${globalProblem?.id}/${key}`}
                className="w-full"
              >
                <span className="mr-2">{item.emoji}</span>
                {item.label}
              </Link>
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <div className="flex items-center justify-between mb-6">
      {/* Left side: Breadcrumbs */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Link 
          href="/"
          className="hover:text-foreground transition-colors"
        >
          <Home className="h-4 w-4" />
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link 
          href="/globalProblems"
          className={cn(
            "hover:text-foreground transition-colors",
            { "text-foreground": segments.length === 1 }
          )}
        >
          Global Problems
        </Link>
        
        {globalProblem && (
          <>
            <ChevronRight className="h-4 w-4" />
            <Link 
              href={`/globalProblems/${globalProblem.id}`}
              className={cn(
                "hover:text-foreground transition-colors",
                { "text-foreground": segments.length === 2 }
              )}
            >
              {globalProblem.name}
            </Link>

            {segments.length > 2 && navigationItems[currentSubpage as keyof NavigationItems] && (
              <>
                <ChevronRight className="h-4 w-4" />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <SubpageDropdown />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{navigationItems[currentSubpage as keyof NavigationItems].description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            )}
          </>
        )}
      </div>

      {/* Right side: Navigation Menu */}
      {globalProblem && (
        <TooltipProvider>
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="ml-auto"
                  >
                    <Menu className="h-4 w-4 mr-2" />
                    Navigate
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Quick navigation to different sections of this problem</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuItem asChild>
                <Link 
                  href={`/globalProblems/${globalProblem.id}`}
                  className={cn(
                    "w-full flex items-center",
                    { "bg-accent": segments.length === 2 }
                  )}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center w-full">
                        <span className="mr-2">{navigationItems.overview.emoji}</span>
                        <span>{navigationItems.overview.label}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{navigationItems.overview.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {(Object.entries(navigationItems) as Array<[keyof NavigationItems, NavigationItem]>)
                .filter(([key]) => key !== 'overview')
                .map(([key, item]) => (
                  <DropdownMenuItem key={key} asChild>
                    <Link 
                      href={`/globalProblems/${globalProblem.id}/${key}`}
                      className={cn(
                        "w-full",
                        { "bg-accent": currentSubpage === key }
                      )}
                    >
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center w-full">
                            <span className="mr-2">{item.emoji}</span>
                            <span>{item.label}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{item.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </Link>
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipProvider>
      )}
    </div>
  )
} 