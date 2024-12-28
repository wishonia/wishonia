"use client"

import {
  GlobalProblem,
  GlobalProblemSolution,
  WishingWell,
} from "@prisma/client"
import React, { FC } from "react"

import MarkdownRenderer from "@/components/markdown/MarkdownRenderer"

interface MarkdownRendererProps {
  item: WishingWell | GlobalProblem | GlobalProblemSolution
}

const MarkdownRendererForItem: FC<MarkdownRendererProps> = ({ item }) => {
  return (
    <div className="relative">
      <div className="p-6 sm:p-8">
        <div className="space-y-4">
          <MarkdownRenderer
            name={item.name}
            description={item.description}
            featuredImage={item.featuredImage}
            content={item.content}
          />
        </div>
      </div>
    </div>
  )
}

export default MarkdownRendererForItem
