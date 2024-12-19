"use client"

import { GlobalProblem } from "@prisma/client"
import { Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const navigationItems = {
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
} as const

interface GlobalProblemNavigationButtonProps {
  globalProblem: GlobalProblem
  variant?: "outline" | "ghost"
  showNavigateText?: boolean
  size?: "default" | "sm"
}

export function GlobalProblemNavigationButton({ 
  globalProblem, 
  variant = "outline",
  showNavigateText = true,
  size = "sm"
}: GlobalProblemNavigationButtonProps) {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)
  const currentSubpage = segments[segments.length - 1]

  return (
    <TooltipProvider>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button 
                variant={variant}
                size={size}
                className="ml-auto"
              >
                <Menu className="h-4 w-4 mr-2" />
                {showNavigateText && "Navigate"}
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
          {(Object.entries(navigationItems) as Array<[keyof typeof navigationItems, typeof navigationItems[keyof typeof navigationItems]]>)
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
  )
} 