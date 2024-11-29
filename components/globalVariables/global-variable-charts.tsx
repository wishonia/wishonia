"use client"

import * as React from "react"
import { FC } from "react"
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
  globalVariable: GlobalVariable
}

export const GlobalVariableCharts: FC<GlobalVariableChartsProps> = ({
  globalVariable,
}) => {

  return (
    <Card>
      <CardHeader>
        <CardTitle>{globalVariable?.name}</CardTitle>
        {globalVariable?.description && (
          <CardDescription>{globalVariable.description}</CardDescription>
        )}
      </CardHeader>
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
      <CardFooter></CardFooter>
    </Card>
  )
}
