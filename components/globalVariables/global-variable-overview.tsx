"use client"

import { FC, useEffect, useState } from "react"
import * as React from "react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { MeasurementsList } from "@/components/measurements/measurements-list"
import { DashboardHeader } from "@/components/pages/dashboard/dashboard-header"
import type { GlobalVariable } from "@/types/models/GlobalVariable"

type GlobalVariableOverviewProps = {
  user: {
    id: string
  }
  variableId: number
  measurementsDateRange: {
    from: string
    to: string
  }
}

export const GlobalVariableOverview: FC<GlobalVariableOverviewProps> = ({
  user,
  variableId,
  measurementsDateRange,
}) => {
  const [globalVariable, setGlobalVariable] = useState<GlobalVariable | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    fetch(`/api/dfda/variables?id=${variableId}&includeCharts=1`)
      .then(r => r.json())
      .then(variables => {
        setGlobalVariable(variables[0])
        setIsLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching variable data:", error)
        setIsLoading(false)
      })
  }, [variableId])

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Icons.spinner className="animate-spin text-4xl" />
      </div>
    )
  }

  return (
    <>
      <DashboardHeader heading={`${globalVariable?.name} Measurements`}>
        <div className="flex items-center gap-4">
          <a
            href="/dfda/globalVariables"
            className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
          >
            <Icons.chevronLeft className="h-4 w-4" />
            Back to Variables
          </a>
        </div>
      </DashboardHeader>

      <div className="w-full bg-white h-[calc(100vh-12rem)]">
        <iframe
          src={`https://studies.dfda.earth/variables/${variableId}`}
          className="w-full h-full border-0"
          title={globalVariable?.name || "Variable Details"}
        />
      </div>
      
      <MeasurementsList
        user={user}
        variableId={variableId}
        measurementsDateRange={measurementsDateRange}
      />
    </>
  )
}
