"use client"

import * as React from "react"
import { FC, useEffect, useState } from "react"

import type { GlobalVariable } from "@/types/models/GlobalVariable"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { DashboardHeader } from "@/components/pages/dashboard/dashboard-header"

type GlobalVariableOverviewProps = {
  variableId: number
}

type JoinedVariable = {
  id: number
  name: string
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
      <div className="neobrutalist-loading">
        <div className="neobrutalist-loading-spinner" />
      </div>
    )
  }

  if (!globalVariable) {
    return (
      <div className="neobrutalist-container">
        <h1 className="neobrutalist-title text-red-500">Variable Not Found</h1>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        heading={globalVariable.name}
        text={globalVariable.description || "View and analyze this variable's data"}
      >
        <div className="flex items-center gap-4">
          <a
            href="/dfda/globalVariables"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "group neobrutalist-button"
            )}
          >
            ← Back to Variables
          </a>
        </div>
      </DashboardHeader>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Overview Card */}
        <div className="neobrutalist-container">
          <h2 className="neobrutalist-h2">Overview</h2>
          <dl className="space-y-4">
            <div>
              <dt className="font-bold text-gray-600">Category</dt>
              <dd className="neobrutalist-strong">
                {globalVariable.variableCategoryName}
              </dd>
            </div>
            {globalVariable.unitName && (
              <div>
                <dt className="font-bold text-gray-600">Unit</dt>
                <dd>{globalVariable.unitName}</dd>
              </div>
            )}
            {globalVariable.commonOptimalValueMessage && (
              <div>
                <dt className="font-bold text-gray-600">Optimal Value</dt>
                <dd className="neobrutalist-em">
                  {globalVariable.commonOptimalValueMessage}
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* Track & Measure Card */}
        <div className="neobrutalist-container">
          <h2 className="neobrutalist-h2">Track & Measure</h2>
          <div className="flex flex-col gap-4">
            <a 
              href={`/dfda/measurements/add?variableId=${variableId}`}
              className="group neobrutalist-button"
            >
              ➕ Add Measurement
            </a>
            <a 
              href={`/dfda/reminders/add?variableId=${variableId}`}
              className="group neobrutalist-button"
            >
              🔔 Set Tracking Reminder
            </a>
          </div>
        </div>

        {/* Statistics Card */}
        <div className="neobrutalist-gradient-container neobrutalist-gradient-pink text-white">
          <h2 className="neobrutalist-h2">Statistics</h2>
          <dl className="grid grid-cols-2 gap-4">
            {globalVariable.numberOfRawMeasurements && (
              <div>
                <dt className="font-bold opacity-80">Total Measurements</dt>
                <dd className="text-2xl font-black">
                  {globalVariable.numberOfRawMeasurements.toLocaleString()}
                </dd>
              </div>
            )}
            {globalVariable.mean !== undefined && (
              <div>
                <dt className="font-bold opacity-80">Average Value</dt>
                <dd className="text-2xl font-black">
                  {globalVariable.mean.toFixed(2)}
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* Studies & Analysis */}
        {(globalVariable.bestStudyCard ||
          globalVariable.bestPopulationStudyCard ||
          globalVariable.bestUserStudyCard) && (
          <div className="neobrutalist-container md:col-span-2">
            <h2 className="neobrutalist-h2">Studies & Analysis</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {globalVariable.bestStudyCard && (
                <a
                  href={globalVariable.bestStudyLink || "#"}
                  className="neobrutalist-gradient-container neobrutalist-gradient-green cursor-pointer"
                >
                  <h3 className="neobrutalist-h3">Best Overall Study</h3>
                  <p className="text-white">
                    {globalVariable.bestStudyCard.title}
                  </p>
                </a>
              )}
              {globalVariable.bestPopulationStudyCard && (
                <a
                  href={globalVariable.bestPopulationStudyLink || "#"}
                  className="neobrutalist-gradient-container neobrutalist-gradient-pink cursor-pointer"
                >
                  <h3 className="neobrutalist-h3">Population Study</h3>
                  <p className="text-white">
                    {globalVariable.bestPopulationStudyCard.title}
                  </p>
                </a>
              )}
              <a 
                href={`/dfda/studies/correlations?variableId=${variableId}`}
                className="neobrutalist-gradient-container neobrutalist-gradient-green cursor-pointer"
              >
                <h3 className="neobrutalist-h3">Correlation Analysis</h3>
                <p className="text-white">
                  Discover factors that may affect {globalVariable.name}
                </p>
              </a>
              <a 
                href={`/dfda/studies/predictors?variableId=${variableId}`}
                className="neobrutalist-gradient-container neobrutalist-gradient-pink cursor-pointer"
              >
                <h3 className="neobrutalist-h3">Predictors</h3>
                <p className="text-white">
                  Variables that may influence {globalVariable.name}
                </p>
              </a>
              <a 
                href={`/dfda/studies/outcomes?variableId=${variableId}`}
                className="neobrutalist-gradient-container neobrutalist-gradient-blue cursor-pointer"
              >
                <h3 className="neobrutalist-h3">Outcomes</h3>
                <p className="text-white">
                  Effects that {globalVariable.name} may have
                </p>
              </a>
            </div>
          </div>
        )}

        {/* Data Visualization */}
        {globalVariable.charts && (
          <div className="neobrutalist-container md:col-span-2">
            <h2 className="neobrutalist-h2">Data Visualization</h2>
            <div className="h-[500px] w-full bg-white">
              <iframe
                src={`https://studies.dfda.earth/variables/${variableId}`}
                className="h-full w-full border-0"
                title={`${globalVariable.name} Charts`}
              />
            </div>
          </div>
        )}

        {/* Additional Information */}
        {globalVariable.trackingInstructions && (
          <div className="neobrutalist-container md:col-span-2">
            <h2 className="neobrutalist-h2">Tracking Instructions</h2>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{
                __html: globalVariable.trackingInstructions,
              }}
            />
          </div>
        )}

        {(globalVariable.joinedVariables && globalVariable.joinedVariables.length > 0) && (
          <div className="neobrutalist-container md:col-span-2">
            <h2 className="neobrutalist-h2">Related Variables</h2>
            <div className="mb-4">
              <h3 className="neobrutalist-h3">Similar Variables</h3>
              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                {globalVariable.joinedVariables.map((variable: JoinedVariable) => (
                  <a 
                    key={variable.id}
                    href={`/dfda/globalVariables/${variable.id}`}
                    className="neobrutalist-button"
                  >
                    {variable.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
