import { WishingWell, GlobalProblem, GlobalProblemSolution } from "@prisma/client"
import React from "react"

import { MarkdownDialogWrapper } from './markdown/markdown-dialog-wrapper'

interface BarChartProps {
  thisItem: WishingWell | GlobalProblem | GlobalProblemSolution
  thatItem: WishingWell | GlobalProblem | GlobalProblemSolution
  thisPercentageDesired?: number
  getItemName: (item: { name: string }) => string
  getItemImage: (item: { featuredImage: string | null }) => string | undefined
}

const BarChartGeneral = ({
  thisItem,
  thatItem,
  thisPercentageDesired,
  getItemName,
  getItemImage,
}: BarChartProps) => {
  const thatPercentageDesired = 100 - (thisPercentageDesired || 0)

  return (
    <div
      id="chart-container"
      style={{ display: "flex", justifyContent: "center", marginBottom: "5px" }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: "600px",
          height: "200px",
          justifyContent: "flex-end",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          <div
            style={{
              width: "48%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-end",
              maxWidth: "200px",
            }}
          >
            <span
              id="thisPercentageDesiredLabel"
              className="text-center text-sm"
            >
              {thisPercentageDesired}% to {getItemName(thisItem)}
            </span>
            
            <MarkdownDialogWrapper item={thatItem}>
            <div
              id={`thisItemBar`}
              style={{
                height: `${thisPercentageDesired}%`,
                width: "100%",
                backgroundImage: getItemImage(thisItem)
                  ? `url(${getItemImage(thisItem)})`
                  : "linear-gradient(to bottom, #007bff, #007bff)",
                backgroundSize: getItemImage(thisItem) ? "cover" : "auto",
                backgroundPosition: "center",
              }}
             />
            </MarkdownDialogWrapper>
          </div>
          <div
            style={{
              width: "48%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-end",
              maxWidth: "200px",
            }}
          >
            <span
              id="thatPercentageDesiredLabel"
              className="text-center text-sm"
            >
              {thatPercentageDesired}% to {getItemName(thatItem)}
            </span>
            <MarkdownDialogWrapper item={thatItem}>
              <div
                id={`thatItemBar`}
                style={{
                  height: `${thatPercentageDesired}%`,
                  width: "100%",
                  backgroundImage: getItemImage(thatItem)
                    ? `url(${getItemImage(thatItem)})`
                    : "linear-gradient(to bottom, #007bff, #007bff)",
                  backgroundSize: getItemImage(thatItem) ? "cover" : "auto",
                  backgroundPosition: "center",
                }}
               />
            </MarkdownDialogWrapper>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BarChartGeneral
