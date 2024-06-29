"use client"

import { cn } from "@/lib/utils"

type AssistantDisplayProps = {
  children: React.ReactNode
}

function AssistantDisplay({ children }: AssistantDisplayProps) {
  return (
    <div className={cn("group flex w-full items-start")}>
      <div className="w-full flex-1 space-y-2 overflow-hidden px-1">
        <span className="font-semibold">AI Assistant</span>
        {children}
      </div>
    </div>
  )
}

export default AssistantDisplay
