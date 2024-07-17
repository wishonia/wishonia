"use client"

import Link from "next/link"
import { GlobalProblem } from "@prisma/client"

import { formatDate } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { GlobalProblemOperations } from "@/components/globalProblem/global-problem-operations"
interface GlobalProblemItemProps {
  globalProblem: Pick<
    GlobalProblem,
    "id" | "name" | "description" | "createdAt"
  >
}

export function GlobalProblemItem({
  globalProblem,
}: GlobalProblemItemProps) {
  return (
    <div className="flex items-center justify-between gap-2 p-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4 md:min-w-[8rem]">
          <div>
            <Link
              href={`/dashboard/globalProblems/${globalProblem.id}`}
              className="font-semibold hover:underline"
            >
              {globalProblem.name}
            </Link>
            <div>
              <p className="text-sm text-muted-foreground">
                {formatDate(globalProblem.createdAt?.toDateString())}
              </p>
            </div>
          </div>
        </div>
        {globalProblem.description ? (
          <div className="text-sm text-muted-foreground">
            {globalProblem.description}
          </div>
        ) : null}
      </div>
      <div className="flex flex-col gap-2 md:flex-row">
        <GlobalProblemOperations
          globalProblem={{
            id: globalProblem.id,
          }}
        />
      </div>
    </div>
  )
}

GlobalProblemItem.Skeleton = function GlobalProblemItemSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  )
}
