"use client"

import * as React from "react"
import { FC, useEffect, useState } from "react"

import type { GlobalVariable } from "@/types/models/GlobalVariable"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { DashboardHeader } from "@/components/pages/dashboard/dashboard-header"

type GlobalVariableOverviewProps = {
  variableId: number
}

export const GlobalVariableOverview: FC<GlobalVariableOverviewProps> = ({
  variableId,
}) => {
  const [globalVariable, setGlobalVariable] = useState<GlobalVariable | null>(
    null
  )
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    fetch(`/api/dfda/variables?id=${variableId}&includeCharts=1`)
      .then((r) => r.json())
      .then((variables) => {
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
      <DashboardHeader
        heading={`${globalVariable?.name} Measurements`}
        text="View and manage measurements for this variable"
      >
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

      <div className="h-[calc(100vh-12rem)] w-full bg-white">
        <iframe
          src={`https://studies.dfda.earth/variables/${variableId}`}
          className="h-full w-full border-0"
          title={globalVariable?.name || "Variable Details"}
        />
      </div>
    </>
  )
}
