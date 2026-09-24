"use client"

import React, { useEffect, useState } from "react"
import {
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js"
import ChartDataLabels from "chartjs-plugin-datalabels"
import { Bar } from "react-chartjs-2"

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
)
const blue = "rgb(0,0,243)"
const data = {
  labels: [
    "War & Military",
    "Heart Disease",
    "Cancer",
    "Mental Disorders",
    "Respiratory Diseases",
    "Neurological Disorders",
    //'Diabetes/Urogenital/Blood/Endocrine diseases',
    "Musculoskeletal Disorders",
    //'Communicable, maternal, neonatal, and nutritional diseases',
  ],
  datasets: [
    // {
    //   label: 'Global Burden (DALYs in millions)',
    //   data: [369.4, 233.1, 163.8, 103.1, 276.6, 205.0, 135.6, 251.0, 55.9, 513.5],
    //   backgroundColor: 'rgba(75, 192, 192, 0.6)',
    // },
    {
      label: "Research Funding (Billions USD)",
      data: [
        2100, // 2021 Global Military Spending
        2.4,
        6.9,
        1.0,
        0.7,
        3.0,
        //1.2,
        0.5,
        //3.5,
      ],
      backgroundColor: [
        "rgba(0, 0, 0, 1)", // color for 'Military Spending'
        blue, // color for 'Cardiovascular diseases'
        blue, // color for 'Neoplasms (Cancers)'
        blue, // color for 'Mental disorders'
        blue, // color for 'Chronic respiratory diseases'
        blue, // color for 'Neurological disorders'
        blue, // color for 'Diabetes/Urogenital/Blood/Endocrine diseases'
        blue, // color for 'Musculoskeletal disorders'
        blue, // color for 'Communicable, maternal, neonatal, and nutritional diseases'
      ],
    },
  ],
}

const options = {
  plugins: {
    legend: {
      display: false, // Set false to hide the legend
    },
    datalabels: {
      align: "end" as const,
      anchor: "end" as const, // Explicitly type as 'end'
      formatter: (value: any, context: any) => {
        return "$" + value + "B"
      },
      color: "#000",
      font: {
        size: 10,
      },
    },
    hooks: {
      // Doesn't work as expected
      afterDraw: (
        chart: {
          chartArea: any
          config: {
            options: { scales: { y: { ticks: { sourcePixelSize: number } } } }
          }
          ctx: {
            drawImage: (
              arg0: HTMLImageElement,
              arg1: any,
              arg2: number,
              arg3: number,
              arg4: number
            ) => void
          }
        },
        args: { datasets: any[] }
      ) => {
        const svgCode = "" // Replace with your SVG code
        const image = new Image()
        image.src = "data:image/svg+xml;base64," + btoa(svgCode) // Convert SVG to base64

        const chartArea = chart.chartArea
        const barWidth = chartArea.width / args.datasets.length
        let xOffset = chartArea.left

        args.datasets.forEach((dataset, index) => {
          const x = xOffset + barWidth * index + barWidth / 2 // Adjust position as needed
          const y =
            chartArea.bottom -
            dataset.data[index] *
              chart.config.options.scales.y.ticks.sourcePixelSize // Calculate Y based on data

          const width = 20 // Adjust as needed
          const height = 20 // Adjust as needed
          chart.ctx.drawImage(image, x, y, width, height) // Adjust width and height for SVG size
          xOffset += barWidth
        })
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false, // This will remove the grid lines from the x-axis
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        display: false, // This will remove the grid lines from the y-axis
      },
      max: 2150,
    },
  },
  maintainAspectRatio: false, // Add this line
}

const SpendingOnDiseasesVsMilitary = () => {
  const [height, setHeight] = useState("0px")

  useEffect(() => {
    const headerHeight = document.querySelector("h2")?.clientHeight || 0
    const screenHeight = window.innerHeight
    const minHeight = 600
    const chartHeight = 0.9 * Math.max(screenHeight - headerHeight, minHeight)
    setHeight(`${chartHeight}px`)
  }, [])

  return (
    <>
      <h2 className="pb-2 text-xl font-bold md:text-3xl">War vs Cures</h2>
      <p className="pb-4 text-xs text-muted-foreground">
        How much we currently spend on war & military vs curing diseases in
        billions of dollars per year.
      </p>
      <div style={{ height: height, width: "100%" }}>
        <Bar data={data} options={options} />
      </div>
    </>
  )
}

export default SpendingOnDiseasesVsMilitary
