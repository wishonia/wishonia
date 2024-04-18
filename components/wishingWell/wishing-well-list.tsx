import { WishingWell } from "@prisma/client"

import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { Icons } from "@/components/icons"

import { WishingWellAddButton } from "./wishing-well-add-button"
import { WishingWellItem } from "./wishing-well-item"

interface WishingWellListProps {
  wishingWells: WishingWell[]
}

export function WishingWellList({ wishingWells }: WishingWellListProps) {
  return (
    <>
      {wishingWells?.length ? (
        <>
          {wishingWells.map((wishingWell) => (
            <WishingWellItem key={wishingWell.id} wishingWell={wishingWell} />
          ))}
        </>
      ) : (
        <EmptyPlaceholder>
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Icons.wishingWell className="h-10 w-10" />
          </div>
          <EmptyPlaceholder.Title>No wishingWells created</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            Add an wishingWell to start monitoring your progress.
          </EmptyPlaceholder.Description>
          <WishingWellAddButton variant="outline" />
        </EmptyPlaceholder>
      )}
    </>
  )
}
