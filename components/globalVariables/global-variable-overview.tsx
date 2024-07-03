"use client"

import { FC, useEffect, useState } from "react"
import * as React from "react"

import { GlobalVariable } from "@/types/models/GlobalVariable"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { DateRangePicker } from "@/components/date-range-picker"
import { GlobalVariableOperationsButton } from "@/components/globalVariables/global-variable-operations-button"
import { Icons } from "@/components/icons"
import { MeasurementsList } from "@/components/measurements/measurements-list"
import { DashboardHeader } from "@/components/pages/dashboard/dashboard-header"

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
  const [globalVariable, setGlobalVariable] = useState<GlobalVariable>()
  const [isLoading, setIsLoading] = useState(true) // Add a loading state

  useEffect(() => {
    setIsLoading(true) // Set loading to true when starting to fetch
    const url = `/api/dfda/variables?variableId=${variableId}`

    fetch(url)
      .then((response) => response.json())
      .then((globalVariables) => {
        setGlobalVariable(globalVariables[0])
        setIsLoading(false) // Set loading to false once data is fetched
      })
      .catch((error) => {
        console.error("Error fetching user variables:", error)
        setIsLoading(false) // Ensure loading is set to false even if there's an error
      })
  }, [user, variableId])

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Icons.spinner className="animate-spin text-4xl" />
      </div>
    )
  }

  // Ensure globalVariable is defined before trying to access its properties
  if (!globalVariable) {
    return <div>No data found.</div> // Handle the case where globalVariable is undefined
  }

  return (
    <>
      <DashboardHeader
        heading={`${globalVariable.name} Measurements`}
        text={globalVariable.description}
      >
        <div className="flex flex-col items-stretch gap-2 md:items-end">
          <DateRangePicker />
          <GlobalVariableOperationsButton globalVariable={globalVariable}>
            <div
              className={cn(buttonVariants({ variant: "outline" }), "w-full")}
            >
              <Icons.down className="mr-2 h-4 w-4" />
              Actions
            </div>
          </GlobalVariableOperationsButton>
        </div>
      </DashboardHeader>
      <MeasurementsList
        user={user}
        variableId={variableId}
        measurementsDateRange={measurementsDateRange}
      ></MeasurementsList>
    </>
  )
}
