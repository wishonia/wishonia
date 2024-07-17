import { GlobalProblem } from "@prisma/client"

import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { Icons } from "@/components/icons"

import { GlobalProblemAddButton } from "./global-problem-add-button"
import { GlobalProblemItem } from "./global-problem-item"

interface GlobalProblemListProps {
  globalProblems: GlobalProblem[]
}

export function UserGlobalProblemList({
  globalProblems,
}: GlobalProblemListProps) {
  return (
    <>
      {globalProblems?.length ? (
        <>
          {globalProblems.map((globalProblem) => (
            <GlobalProblemItem
              key={globalProblem.id}
              globalProblem={globalProblem}
            />
          ))}
        </>
      ) : (
        <EmptyPlaceholder>
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Icons.lightbulb className="h-10 w-10" />
          </div>
          <EmptyPlaceholder.Title>
            No problems reported!
          </EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            Submit a problem!
          </EmptyPlaceholder.Description>
          <GlobalProblemAddButton variant="outline" />
        </EmptyPlaceholder>
      )}
    </>
  )
}
