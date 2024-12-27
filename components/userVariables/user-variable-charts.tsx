"use client"

import * as React from "react"
import { FC } from "react"
import { useEffect, useState } from "react"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"

import { UserVariable } from "@/types/models/UserVariable"
// TODO: Fix highcharts accessibility
// import highchartsAccessibility from "highcharts/modules/accessibility";
// if (typeof window !== undefined) {
//   highchartsAccessibility(Highcharts);
// }

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { MeasurementButton } from "@/components/measurements/measurement-button"

import { Icons } from "../icons"

interface UserVariableChartsProps
  extends React.HTMLAttributes<HTMLFormElement> {
  variableId: number
}

export const UserVariableCharts: FC<UserVariableChartsProps> = ({
  variableId,
}) => {
  const [userVariable, setUserVariable] = useState<UserVariable>()
  const [isLoading, setIsLoading] = useState(true) // Add a loading state
  const [showMeasurementAlert, setShowMeasurementAlert] =
    React.useState<boolean>(false)

  useEffect(() => {
    const url = `/api/dfda/userVariables?variableId=${variableId}&includeCharts=1`

    setIsLoading(true) // Set loading to true when the fetch starts
    fetch(url)
      .then((response) => response.json())
      .then((userVariables) => {
        const userVariable = userVariables[0]
        if (userVariable?.charts) {
          delete userVariable.charts.lineChartWithSmoothing?.highchartConfig
            ?.tooltip?.formatter
          delete userVariable.charts.weekdayColumnChart?.highchartConfig
            ?.tooltip?.formatter
          delete userVariable.charts.monthlyColumnChart?.highchartConfig
            ?.tooltip?.formatter
        }
        setUserVariable(userVariable)
        setIsLoading(false) // Set loading to false when the fetch completes
      })
      .catch((error) => {
        console.error("Error fetching user variables:", error)
        setIsLoading(false) // Ensure loading is set to false on error as well
      })
  }, [variableId])

  const handleRecordMeasurement = () => {
    // Logic to record a new measurement
    console.log("Record a new measurement")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{userVariable?.name}</CardTitle>
        {userVariable?.description && (
          <CardDescription>{userVariable.description}</CardDescription>
        )}
      </CardHeader>
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Icons.spinner className="animate-spin text-4xl" />
        </div>
      ) : (
        <CardContent id="chart-card" className="space-y-4">
          {userVariable?.numberOfRawMeasurements && userVariable?.charts ? (
            <div className="card transparent-bg highcharts-container">
              {userVariable.charts.lineChartWithSmoothing?.highchartConfig && (
                <HighchartsReact
                  highcharts={Highcharts}
                  options={
                    userVariable.charts.lineChartWithSmoothing.highchartConfig
                  }
                />
              )}
              {userVariable.charts.monthlyColumnChart?.highchartConfig && (
                <HighchartsReact
                  highcharts={Highcharts}
                  options={
                    userVariable.charts.monthlyColumnChart.highchartConfig
                  }
                />
              )}
              {userVariable.charts.weekdayColumnChart?.highchartConfig && (
                <HighchartsReact
                  highcharts={Highcharts}
                  options={
                    userVariable.charts.weekdayColumnChart.highchartConfig
                  }
                />
              )}
            </div>
          ) : (
            <div>No chart data available.</div>
          )}
        </CardContent>
      )}
      <CardFooter>
        {userVariable && (
          <MeasurementButton
            genericVariable={userVariable}
            className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-muted"
            variant="outline"
            size="lg"
          />
        )}
      </CardFooter>
    </Card>
  )
}
