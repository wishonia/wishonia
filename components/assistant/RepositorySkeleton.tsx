import AssistantDisplay from "../AssistantDisplay"
import { Skeleton } from "../ui/skeleton"

function RepositorySkeleton() {
  return (
    <AssistantDisplay>
      <div className="flex w-full flex-col items-start gap-2 rounded-md border p-2">
        <div className="flex items-start gap-2">
          <Skeleton className="size-7 animate-pulse rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-2 w-[100px] animate-pulse" />
            <Skeleton className="h-2 w-[150px] animate-pulse" />
            <Skeleton className="h-2 w-[250px] animate-pulse" />
          </div>
        </div>
        <div className="flex items-center gap-2 pl-9">
          <Skeleton className="h-4 w-7 animate-pulse" />
          <Skeleton className="h-4 w-7 animate-pulse" />
          <Skeleton className="h-4 w-14 animate-pulse" />
          <Skeleton className="h-4 w-7 animate-pulse" />
          <Skeleton className="h-4 w-9 animate-pulse" />
          <Skeleton className="h-4 w-11 animate-pulse" />
          <Skeleton className="h-4 w-11 animate-pulse" />
          <Skeleton className="h-4 w-7 animate-pulse" />
        </div>
        <Skeleton className="ml-9 h-2 w-[250px] animate-pulse" />
      </div>
      <div className="flex w-full flex-col items-start gap-2 rounded-md border p-2">
        <div className="flex items-start gap-2">
          <Skeleton className="size-7 animate-pulse rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-2 w-[100px] animate-pulse" />
            <Skeleton className="h-2 w-[150px] animate-pulse" />
            <Skeleton className="h-2 w-[250px] animate-pulse" />
          </div>
        </div>
        <div className="flex items-center gap-2 pl-9">
          <Skeleton className="h-4 w-7 animate-pulse" />
          <Skeleton className="h-4 w-7 animate-pulse" />
          <Skeleton className="h-4 w-14 animate-pulse" />
          <Skeleton className="h-4 w-7 animate-pulse" />
          <Skeleton className="h-4 w-9 animate-pulse" />
          <Skeleton className="h-4 w-11 animate-pulse" />
          <Skeleton className="h-4 w-11 animate-pulse" />
          <Skeleton className="h-4 w-7 animate-pulse" />
        </div>
        <Skeleton className="ml-9 h-2 w-[250px] animate-pulse" />
      </div>
      <div className="flex w-full flex-col items-start gap-2 rounded-md border p-2">
        <div className="flex items-start gap-2">
          <Skeleton className="size-7 animate-pulse rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-2 w-[100px] animate-pulse" />
            <Skeleton className="h-2 w-[150px] animate-pulse" />
            <Skeleton className="h-2 w-[250px] animate-pulse" />
          </div>
        </div>
        <div className="flex items-center gap-2 pl-9">
          <Skeleton className="h-4 w-7 animate-pulse" />
          <Skeleton className="h-4 w-7 animate-pulse" />
          <Skeleton className="h-4 w-14 animate-pulse" />
          <Skeleton className="h-4 w-7 animate-pulse" />
          <Skeleton className="h-4 w-9 animate-pulse" />
          <Skeleton className="h-4 w-11 animate-pulse" />
          <Skeleton className="h-4 w-11 animate-pulse" />
          <Skeleton className="h-4 w-7 animate-pulse" />
        </div>
        <Skeleton className="ml-9 h-2 w-[250px] animate-pulse" />
      </div>
      <div className="flex w-full flex-col items-start gap-2 rounded-md border p-2">
        <div className="flex items-start gap-2">
          <Skeleton className="size-7 animate-pulse rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-2 w-[100px] animate-pulse" />
            <Skeleton className="h-2 w-[150px] animate-pulse" />
            <Skeleton className="h-2 w-[250px] animate-pulse" />
          </div>
        </div>
        <div className="flex items-center gap-2 pl-9">
          <Skeleton className="h-4 w-7 animate-pulse" />
          <Skeleton className="h-4 w-7 animate-pulse" />
          <Skeleton className="h-4 w-14 animate-pulse" />
          <Skeleton className="h-4 w-7 animate-pulse" />
          <Skeleton className="h-4 w-9 animate-pulse" />
          <Skeleton className="h-4 w-11 animate-pulse" />
          <Skeleton className="h-4 w-11 animate-pulse" />
          <Skeleton className="h-4 w-7 animate-pulse" />
        </div>
        <Skeleton className="ml-9 h-2 w-[250px] animate-pulse" />
      </div>
    </AssistantDisplay>
  )
}

export default RepositorySkeleton
