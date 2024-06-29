import { GlobalSolution } from "@prisma/client"

import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { Icons } from "@/components/icons"

import { GlobalSolutionAddButton } from "./global-solution-add-button"
import { GlobalSolutionItem } from "./global-solution-item"

interface GlobalSolutionListProps {
  globalSolutions: GlobalSolution[]
}

export function UserGlobalSolutionList({
  globalSolutions,
}: GlobalSolutionListProps) {
  return (
    <>
      {globalSolutions?.length ? (
        <>
          {globalSolutions.map((globalSolution) => (
            <GlobalSolutionItem
              key={globalSolution.id}
              globalSolution={globalSolution}
            />
          ))}
        </>
      ) : (
        <EmptyPlaceholder>
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Icons.lightbulb className="h-10 w-10" />
          </div>
          <EmptyPlaceholder.Title>
            No global solutions made!
          </EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            Make a global solution!
          </EmptyPlaceholder.Description>
          <GlobalSolutionAddButton variant="outline" />
        </EmptyPlaceholder>
      )}
    </>
  )
}
