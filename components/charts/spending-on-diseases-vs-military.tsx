"use client"

import React, { useEffect, useRef } from "react"

const SpendingOnDiseasesVsMilitary = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chartContainerRef.current) {
      const chartHeight = chartContainerRef.current.offsetHeight
      if (chartHeight > 0) {
        drawChart(chartHeight)
      }
    }
  }, [chartContainerRef.current]) // Depend on the ref's current value

  const drawChart = (chartHeight: number) => {
    const data = [
      { label: "Military Spending", value: 2100, color: "rgba(0, 0, 0, 1)" },
      { label: "Cardiovascular diseases", value: 2.4, color: "rgb(0, 0, 243)" },
      { label: "Neoplasms (Cancers)", value: 6.9, color: "rgb(0, 0, 243)" },
      { label: "Mental disorders", value: 1.0, color: "rgb(0, 0, 243)" },
      {
        label: "Chronic respiratory diseases",
        value: 0.7,
        color: "rgb(0, 0, 243)",
      },
      { label: "Neurological disorders", value: 3.0, color: "rgb(0, 0, 243)" },
      {
        label: "Musculoskeletal disorders",
        value: 0.5,
        color: "rgb(0, 0, 243)",
      },
    ]

    const chartContainer = chartContainerRef.current
    if (!chartContainer) {
      throw new Error(
        "Could not find spending-on-diseases-vs-military-chart-container element"
      )
    }
    const barWidth = 50
    const barGap = 20
    const maxValue = 2150
    const chartWidth = data.length * (barWidth + barGap)

    chartContainer.style.width = `${chartWidth}px`

    data.forEach((item, index) => {
      const barHeight = (item.value / maxValue) * chartHeight
      const bar = document.createElement("div")
      bar.className = "bar"
      bar.style.width = `${barWidth}px`
      bar.style.height = `${barHeight}px`
      bar.style.backgroundColor = item.color
      bar.style.position = "absolute"
      bar.style.bottom = "0"
      bar.style.left = `${index * (barWidth + barGap)}px`

      const label = document.createElement("div")
      label.className = "label"
      label.textContent = item.label
      label.style.position = "absolute"
      label.style.bottom = "-20px"
      label.style.left = "50%"
      label.style.transform = "translateX(-50%)"
      label.style.fontSize = "12px"
      label.style.textAlign = "center"
      label.style.width = `${barWidth}px`

      const value = document.createElement("div")
      value.className = "value"
      value.textContent = `$${item.value}B`
      value.style.position = "absolute"
      value.style.top = "-20px"
      value.style.left = "50%"
      value.style.transform = "translateX(-50%)"
      value.style.fontSize = "12px"

      bar.appendChild(label)
      bar.appendChild(value)
      chartContainer.appendChild(bar)
    })
  }

  return (
    <>
      <h2>Military Spending Compared to Spending on Research for Diseases</h2>
      <div
        ref={chartContainerRef}
        id="spending-on-diseases-vs-military-chart-container"
        style={{ height: "auto", position: "relative" }}
      ></div>
    </>
  )
}

export default SpendingOnDiseasesVsMilitary
