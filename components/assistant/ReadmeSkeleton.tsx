import React from "react"

import AssistantDisplay from "../AssistantDisplay"
import { Skeleton } from "../ui/skeleton"

function ReadmeSkeleton() {
  return (
    <AssistantDisplay>
      <div className="space-y-5 rounded-md border p-2">
        <Skeleton className="size-40" />
        <div className="space-y-2">
          <Skeleton className="h-2 w-[650px]" />
          <Skeleton className="h-2 w-[650px]" />
          <Skeleton className="h-2 w-[600px]" />
          <Skeleton className="h-2 w-[650px]" />
          <Skeleton className="h-2 w-[550px]" />
        </div>
        <div className="flex space-x-2">
          <Skeleton className="size-20" />
          <Skeleton className="size-20" />
          <Skeleton className="size-20" />
          <Skeleton className="size-20" />
          <Skeleton className="size-20" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-12" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-2 w-[450px]" />
          <Skeleton className="h-2 w-[450px]" />
          <Skeleton className="h-2 w-[400px]" />
          <Skeleton className="h-2 w-[450px]" />
          <Skeleton className="h-2 w-[350px]" />
        </div>
      </div>
    </AssistantDisplay>
  )
}

export default ReadmeSkeleton
