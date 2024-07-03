"use client"

import * as React from "react"
import { FC } from "react"
import { useEffect, useState } from "react"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"

import { GlobalVariable } from "@/types/models/GlobalVariable"
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

import { Icons } from "../icons"

interface GlobalVariableChartsProps
  extends React.HTMLAttributes<HTMLFormElement> {
  variableId: number
}

export const GlobalVariableCharts: FC<GlobalVariableChartsProps> = ({
  variableId,
}) => {
  const [globalVariable, setGlobalVariable] = useState<GlobalVariable>()
  const [isLoading, setIsLoading] = useState(true) // Add a loading state

  useEffect(() => {
    const url = `/api/dfda/variables?variableId=${variableId}&includeCharts=1`

    setIsLoading(true) // Set loading to true when the fetch starts
    fetch(url)
      .then((response) => response.json())
      .then((globalVariables) => {
        const globalVariable = globalVariables[0]
        delete globalVariable.charts.lineChartWithSmoothing.highchartConfig
          .tooltip.formatter
        delete globalVariable.charts.weekdayColumnChart.highchartConfig.tooltip
          .formatter
        delete globalVariable.charts.monthlyColumnChart.highchartConfig.tooltip
          .formatter
        setGlobalVariable(globalVariable)
        setIsLoading(false) // Set loading to false when the fetch completes
      })
      .catch((error) => {
        console.error("Error fetching user variables:", error)
        setIsLoading(false) // Ensure loading is set to false on error as well
      })
  }, [variableId])

  return (
    <Card>
      <CardHeader>
        <CardTitle>{globalVariable?.name}</CardTitle>
        {globalVariable?.description && (
          <CardDescription>{globalVariable.description}</CardDescription>
        )}
      </CardHeader>
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Icons.spinner className="animate-spin text-4xl" />
        </div>
      ) : (
        <CardContent id="chart-card" className="space-y-4">
          <div className="card transparent-bg highcharts-container">
            <HighchartsReact
              highcharts={Highcharts}
              options={
                globalVariable?.charts?.lineChartWithSmoothing?.highchartConfig
              }
            />
            <HighchartsReact
              highcharts={Highcharts}
              options={
                globalVariable?.charts?.monthlyColumnChart?.highchartConfig
              }
            />
            <HighchartsReact
              highcharts={Highcharts}
              options={
                globalVariable?.charts?.weekdayColumnChart?.highchartConfig
              }
            />
          </div>
        </CardContent>
      )}
      <CardFooter></CardFooter>
    </Card>
  )
}
