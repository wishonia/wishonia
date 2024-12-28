"use client"

import { GlobalProblem } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { GlobalProblemNavigationButton } from "./GlobalProblemNavigationButton"

interface GlobalProblemListItemProps {
  problem: GlobalProblem
}

export function GlobalProblemListItem({ problem }: GlobalProblemListItemProps) {
  const shouldShowImage = problem.featuredImage && !problem.featuredImage.includes('placeholder');

  return (
    <div className="group relative flex flex-col rounded-lg border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="absolute right-2 top-2 z-10">
        <GlobalProblemNavigationButton
          globalProblem={problem}
          variant="ghost"
          showNavigateText={false}
        />
      </div>

      <div className="flex flex-col p-4 sm:p-6">
        {/* Title Section */}
        <div className="flex items-start gap-4 mb-3">
          {shouldShowImage && (
            <div className="flex-shrink-0 hidden sm:block">
              <Image
                src={problem.featuredImage!}
                alt={problem.name}
                width={80}
                height={80}
                className="rounded-lg object-cover"
              />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <Link
              href={`/globalProblems/${problem.id}`}
              className={cn(
                buttonVariants({ variant: "link" }), 
                "p-0 h-auto font-semibold text-xl break-words hover:no-underline group-hover:text-primary"
              )}
            >
              {problem.name}
            </Link>
          </div>
        </div>

        {/* Description Section */}
        {problem.description && (
          <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
            {problem.description}
          </p>
        )}

        {/* Stats Section */}
        {problem.averageAllocation && (
          <div className="mt-auto pt-3 border-t text-sm text-muted-foreground">
            <span>
              Average allocation: <span className="font-medium text-foreground">{problem.averageAllocation.toFixed(1)}%</span>
            </span>
          </div>
        )}
      </div>
    </div>
  )
} 