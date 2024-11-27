"use client"

import Link from "next/link"

import { GlobalVariable } from "@/types/models/GlobalVariable"
import { Skeleton } from "@/components/ui/skeleton"
import { GlobalVariableOperationsButton } from "@/components/globalVariables/global-variable-operations-button"
import { MeasurementButton } from "@/components/measurements/measurement-button"
import { QuickMeasurementButton } from "@/components/measurements/quick-measurement-button"

import { Icons } from "../icons"

interface GlobalVariableItemProps {
  globalVariable: GlobalVariable
}
export function GlobalVariableItem({
  globalVariable,
}: GlobalVariableItemProps) {
  return (
    <div className="flex items-center justify-between gap-2 p-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4 md:min-w-[8rem]">
          {globalVariable.imageUrl && (
            <img
              src={globalVariable.imageUrl}
              alt={globalVariable.name}
              style={{ maxWidth: "25%", width: "50px" }}
            />
          )}
          <div>
            <Link
              href={`/dashboard/globalVariables/${globalVariable.variableId}`}
              className="font-semibold hover:underline"
            >
              {globalVariable.name}
            </Link>
            {/*            <div>
              <p className="text-sm text-muted-foreground">
                {formatDate(globalVariable.createdAt?.toDateString())}
              </p>
            </div>*/}
          </div>
        </div>
        {/*        {globalVariable.description ? (
          <div className="text-sm text-muted-foreground">
            {globalVariable.description}
          </div>
        ) : null}*/}
      </div>
      <div id="variable-buttons" className="flex flex-row gap-2">
        <MeasurementButton
          genericVariable={globalVariable}
          className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-muted"
          variant="outline"
          size="default"
        />
        <QuickMeasurementButton
          genericVariable={globalVariable}
          className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-muted"
          variant="outline"
          size="icon"
        />
        <Link
          href={`/dashboard/globalVariables/${globalVariable.variableId}`}
          className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-muted"
        >
          <Icons.history className="h-4 w-4" />
        </Link>
        <Link
          href={`/dashboard/globalVariables/${globalVariable.variableId}/charts`}
          className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-muted"
        >
          <Icons.charts className="h-4 w-4" />
        </Link>
        <GlobalVariableOperationsButton globalVariable={globalVariable} />
      </div>
    </div>
  )
}

GlobalVariableItem.Skeleton = function GlobalVariableItemSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  )
}
