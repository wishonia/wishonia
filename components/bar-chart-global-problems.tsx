import { GlobalProblem } from "@prisma/client"
import React from "react"

import BarChartGeneral from "@/components/bar-chart-general"

interface BarChartProps {
  thisGlobalProblem: GlobalProblem
  thatGlobalProblem: GlobalProblem
  thisPercentageDesired?: number
}

const BarChartGlobalProblems: React.FC<BarChartProps> = ({
  thisGlobalProblem,
  thatGlobalProblem,
  thisPercentageDesired,
}) => {
  const getGlobalProblemName = (item: { name: string }) =>
    "Solving " + item.name
  const getGlobalProblemImage = (item: { featuredImage: string | null }) =>
    item.featuredImage || ""

  return (
    <BarChartGeneral
      thisItem={thisGlobalProblem}
      thatItem={thatGlobalProblem}
      thisPercentageDesired={thisPercentageDesired}
      getItemName={getGlobalProblemName}
      getItemImage={getGlobalProblemImage}
    />
  )
}

export default BarChartGlobalProblems
