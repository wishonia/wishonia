"use client"

import React from "react"
import { WishingWell, WishingWellPairAllocation } from "@prisma/client"
import { PollSpecificGeneral } from "@/components/poll-specific-general"

interface PollProps {
  thisWishingWell: WishingWell
  thatWishingWell: WishingWell
  updatePair?: () => void
}

export const PollSpecificWishingWells: React.FC<PollProps> = ({
  thisWishingWell,
  thatWishingWell,
  updatePair,
}) => {
  const getWishingWellName = (item: { name: string }) => item.name

  const getWishingWellImage = (item: { featuredImage: string | null }) =>
    item.featuredImage || ""

  const createWishingWellAllocation = (
    thisWishingWellId: string,
    thatWishingWellId: string,
    thisWishingWellPercentage: number
  ) => {
    const allocation: Partial<WishingWellPairAllocation> = {
      thisWishingWellId,
      thatWishingWellId,
      thisWishingWellPercentage,
    }
    localStorage.setItem(
      "wishingWellPairAllocation",
      JSON.stringify(allocation)
    )
  }

  return (
    <PollSpecificGeneral
      thisItem={thisWishingWell}
      thatItem={thatWishingWell}
      updatePair={updatePair}
      getItemName={getWishingWellName}
      getItemImage={getWishingWellImage}
      createAllocation={createWishingWellAllocation}
    />
  )
}
