import React from "react"
import { GlobalProblem } from "@prisma/client"

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
  const getGlobalProblemName = (globalProblem: GlobalProblem) =>
    "Solving " + globalProblem.name
  const getGlobalProblemImage = (globalProblem: GlobalProblem) =>
    globalProblem.featuredImage || ""

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
