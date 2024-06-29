"use client"

import Link from "next/link"
import { WishingWell } from "@prisma/client"

import { formatDate } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { WishingWellOperations } from "@/components/wishingWell/wishing-well-operations"
import { QuickWishingWellContributionButton } from "@/components/wishingWell/wishingWellContributions/quick-wishing-well-contribution-button"

interface WishingWellItemProps {
  wishingWell: Pick<WishingWell, "id" | "name" | "description" | "createdAt">
}

export function WishingWellItem({ wishingWell }: WishingWellItemProps) {
  return (
    <div className="flex items-center justify-between gap-2 p-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4 md:min-w-[8rem]">
          <div>
            <Link
              href={`/dashboard/wishingWells/${wishingWell.id}`}
              className="font-semibold hover:underline"
            >
              {wishingWell.name}
            </Link>
            <div>
              <p className="text-sm text-muted-foreground">
                {formatDate(wishingWell.createdAt?.toDateString())}
              </p>
            </div>
          </div>
        </div>
        {wishingWell.description ? (
          <div className="text-sm text-muted-foreground">
            {wishingWell.description}
          </div>
        ) : null}
      </div>
      <div className="flex flex-col gap-2 md:flex-row">
        <QuickWishingWellContributionButton
          wishingWellId={wishingWell.id}
          className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-muted"
          variant="outline"
          size="icon"
        />
        <WishingWellOperations
          wishingWell={{
            id: wishingWell.id,
          }}
        />
      </div>
    </div>
  )
}

WishingWellItem.Skeleton = function WishingWellItemSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  )
}
