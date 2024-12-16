import React from "react"
import { WishingWell } from "@prisma/client"

import BarChartGeneral from "@/components/bar-chart-general"

interface BarChartProps {
  thisWishingWell: WishingWell
  thatWishingWell: WishingWell
  thisPercentageDesired?: number
}

const BarChartWishingWells: React.FC<BarChartProps> = ({
  thisWishingWell,
  thatWishingWell,
  thisPercentageDesired,
}) => {
  const getWishingWellName = (item: { name: string }) => item.name
  
  const getWishingWellImage = (item: { featuredImage: string | null }) =>
    item.featuredImage || ""

  return (
    <BarChartGeneral
      thisItem={thisWishingWell}
      thatItem={thatWishingWell}
      thisPercentageDesired={thisPercentageDesired}
      getItemName={getWishingWellName}
      getItemImage={getWishingWellImage}
    />
  )
}

export default BarChartWishingWells
