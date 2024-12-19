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
  return (
    <div className="flex items-start gap-4 rounded-lg border p-4 hover:bg-muted/50">
      <div className="flex-shrink-0">
        <Image
          src={problem.featuredImage || "/placeholder.png"}
          alt={problem.name}
          width={100}
          height={100}
          className="rounded-lg object-cover"
        />
      </div>
      
      <div className="flex flex-col flex-grow gap-2">
        <div className="flex items-center justify-between">
          <Link
            href={`/globalProblems/${problem.id}`}
            className={cn(buttonVariants({ variant: "link" }), "p-0 h-auto font-semibold text-xl")}
          >
            {problem.name}
          </Link>
          <GlobalProblemNavigationButton
            globalProblem={problem}
            variant="ghost"
            showNavigateText={false}
          />

        </div>

        {problem.description && (
          <p className="text-muted-foreground line-clamp-2">
            {problem.description}
          </p>
        )}


        {problem.averageAllocation && (
        <div className="flex items-center justify-between mt-2">
            <span className="text-muted-foreground">
                Avg person thinks {problem.averageAllocation.toFixed(1)}% should go to solving {problem.name}.
            </span>
            </div>
          )}
      </div>
    </div>
  )
} 