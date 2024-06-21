"use client"

import Link from "next/link"
import { GlobalSolution } from "@prisma/client"

import { formatDate } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { GlobalSolutionOperations } from "@/components/globalSolution/global-solution-operations"
import { QuickGlobalSolutionContributionButton } from "@/components/globalSolution/globalSolutionContributions/quick-global-solution-contribution-button"

interface GlobalSolutionItemProps {
  globalSolution: Pick<
    GlobalSolution,
    "id" | "name" | "description" | "createdAt"
  >
}

export function GlobalSolutionItem({ globalSolution }: GlobalSolutionItemProps) {
  return (
    <div className="flex items-center justify-between gap-2 p-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4 md:min-w-[8rem]">
          <div>
            <Link
              href={`/dashboard/globalSolutions/${globalSolution.id}`}
              className="font-semibold hover:underline"
            >
              {globalSolution.name}
            </Link>
            <div>
              <p className="text-sm text-muted-foreground">
                {formatDate(globalSolution.createdAt?.toDateString())}
              </p>
            </div>
          </div>
        </div>
        {globalSolution.description ? (
          <div className="text-sm text-muted-foreground">
            {globalSolution.description}
          </div>
        ) : null}
      </div>
      <div className="flex flex-col gap-2 md:flex-row">
        <QuickGlobalSolutionContributionButton
          globalSolutionId={globalSolution.id}
          className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-muted"
          variant="outline"
          size="icon"
        />
        <GlobalSolutionOperations
          globalSolution={{
            id: globalSolution.id,
          }}
        />
      </div>
    </div>
  )
}

GlobalSolutionItem.Skeleton = function GlobalSolutionItemSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  )
}
