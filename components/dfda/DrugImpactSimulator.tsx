"use client"

import { HelpCircle } from "lucide-react"
import React, { useState } from "react"
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

interface DrugImpactProfile {
  name: string
  peopleHelped: number
  averageYearsHelpedPerPerson: number
  peopleHarmed: number
  averageYearsHarmedPerPerson: number
}

const DrugImpactSimulator: React.FC = () => {
  const [formData, setFormData] = useState<DrugImpactProfile>({
    name: "Example Drug",
    peopleHelped: 10000,
    averageYearsHelpedPerPerson: 5,
    peopleHarmed: 1000,
    averageYearsHarmedPerPerson: 2,
  })

  const [activeTooltip, setActiveTooltip] = useState<
    keyof DrugImpactProfile | null
  >(null)

  const handleInputChange = (
    name: keyof DrugImpactProfile,
    value: number | string
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "name" ? value : parseFloat(value as string) || 0,
    }))
  }

  const totalPositiveImpact =
    formData.peopleHelped * formData.averageYearsHelpedPerPerson
  const totalNegativeImpact =
    formData.peopleHarmed * formData.averageYearsHarmedPerPerson
  const netImpact = totalPositiveImpact - totalNegativeImpact

  const renderInput = (key: keyof DrugImpactProfile) => {
    const value = formData[key]
    if (typeof value !== "number") return null

    return (
      <input
        type="number"
        id={key}
        name={key}
        value={value}
        onChange={(e) => handleInputChange(key, e.target.value)}
        className="w-full rounded border border-gray-300 bg-gray-100 p-2 text-right"
        step="1"
      />
    )
  }

  const chartData = [
    { name: "Lives Improved", value: totalPositiveImpact },
    { name: "Lives Harmed", value: -totalNegativeImpact },
    { name: "Net Impact", value: netImpact },
  ]

  return (
    <div className="mx-auto w-full max-w-4xl bg-gradient-to-b from-blue-100 to-green-100 p-8 font-sans">
      <h2 className="mb-8 rounded-lg bg-blue-600 p-4 text-center text-4xl font-bold text-white shadow-lg">
        Easy Drug Impact Calculator
      </h2>

      <div className="mb-8 rounded-lg bg-white p-6 shadow-lg">
        <h3 className="mb-4 rounded bg-blue-500 p-2 text-2xl font-bold text-white">
          What's this all about?
        </h3>
        <p className="mb-4">
          Imagine you're deciding whether to give out a new candy. You want to
          know if it will make more kids happy or upset. That's what we're doing
          here, but with medicine instead of candy, and for grown-ups too!
        </p>
        <p>
          We're going to look at how many people a new medicine might help, and
          how many it might accidentally hurt. Then we'll see if overall, it
          does more good than harm.
        </p>
      </div>

      <div className="mb-8 rounded-lg bg-white p-6 shadow-lg">
        <h3 className="mb-4 rounded bg-blue-500 p-2 text-2xl font-bold text-white">
          Let's Play with Numbers!
        </h3>
        <form className="space-y-6">
          <div className="border-b-2 border-gray-200 pb-4">
            <label htmlFor="name" className="text-lg font-bold">
              Medicine Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="mt-1 w-full rounded border border-gray-300 bg-gray-100 p-2"
            />
          </div>
          {(Object.keys(formData) as Array<keyof DrugImpactProfile>)
            .filter((key) => key !== "name")
            .map((key) => (
              <div
                key={key}
                className="relative border-b-2 border-gray-200 pb-4"
              >
                <div className="flex items-center justify-between">
                  <label
                    htmlFor={key}
                    className="flex items-center text-lg font-bold"
                  >
                    {key === "peopleHelped"
                      ? "Number of People Helped"
                      : key === "averageYearsHelpedPerPerson"
                        ? "Years of Better Life per Person Helped"
                        : key === "peopleHarmed"
                          ? "Number of People Harmed"
                          : "Years of Worse Life per Person Harmed"}
                    <HelpCircle
                      className="ml-2 cursor-help text-gray-500"
                      size={20}
                      onMouseEnter={() => setActiveTooltip(key)}
                      onMouseLeave={() => setActiveTooltip(null)}
                    />
                  </label>
                  <div className="flex w-1/3 items-center">
                    {renderInput(key)}
                  </div>
                </div>
                {activeTooltip === key && (
                  <div className="absolute z-10 mt-1 rounded bg-black p-2 text-sm text-white shadow-lg">
                    {key === "peopleHelped"
                      ? "How many people might this medicine help feel better?"
                      : key === "averageYearsHelpedPerPerson"
                        ? "For each person helped, how many years might they feel better?"
                        : key === "peopleHarmed"
                          ? "How many people might have bad side effects from this medicine?"
                          : "For each person harmed, how many years might they feel worse?"}
                  </div>
                )}
              </div>
            ))}
        </form>
      </div>

      <div className="mb-8 rounded-lg bg-white p-6 shadow-lg">
        <h3 className="mb-4 rounded bg-blue-500 p-2 text-2xl font-bold text-white">
          What Did We Find Out?
        </h3>
        <p className="mb-4">
          Now, let's see what happens if we give out this medicine:
        </p>
        <ul className="mb-4 list-inside list-disc space-y-2">
          <li>
            {formData.peopleHelped.toLocaleString()} people might feel better
            for about {formData.averageYearsHelpedPerPerson} years each.
          </li>
          <li>
            {formData.peopleHarmed.toLocaleString()} people might feel worse for
            about {formData.averageYearsHarmedPerPerson} years each.
          </li>
        </ul>
        <p className="font-bold">
          Total Impact:{" "}
          {netImpact > 0
            ? "This medicine might do more good than harm!"
            : "This medicine might do more harm than good."}
        </p>
        <div className="mt-8">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value">
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.value > 0 ? "#4CAF50" : "#FF5252"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-4">
          The green bar shows how many years of better life we might give
          people. The red bar shows how many years of worse life some people
          might have. The blue bar shows the overall effect - if it's above
          zero, the medicine helps more than it hurts!
        </p>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h3 className="mb-4 rounded bg-blue-500 p-2 text-2xl font-bold text-white">
          What Does This Mean?
        </h3>
        <p className="mb-4">If we approve this medicine:</p>
        <ul className="mb-4 list-inside list-disc space-y-2">
          <li>
            We might make life better for{" "}
            {formData.peopleHelped.toLocaleString()} people.
          </li>
          <li>
            But we might also make life worse for{" "}
            {formData.peopleHarmed.toLocaleString()} people.
          </li>
          <li>
            Overall, we're adding {totalPositiveImpact.toLocaleString()} years
            of better life and {totalNegativeImpact.toLocaleString()} years of
            worse life.
          </li>
          <li>
            The net result is {Math.abs(netImpact).toLocaleString()} years of{" "}
            {netImpact > 0 ? "better" : "worse"} life.
          </li>
        </ul>
        <p className="mb-4">If we don't approve this medicine:</p>
        <ul className="mb-4 list-inside list-disc space-y-2">
          <li>
            We won't help those {formData.peopleHelped.toLocaleString()} people
            who could have felt better.
          </li>
          <li>
            But we also won't harm those{" "}
            {formData.peopleHarmed.toLocaleString()} people who would have had
            side effects.
          </li>
          <li>
            The net result is 0 - we neither help nor harm anyone with this
            specific medicine.
          </li>
        </ul>
        <p>
          Remember, this is a very simple way of looking at things. In real
          life, doctors and scientists look at many more details before deciding
          if a medicine is safe and helpful!
        </p>
      </div>
    </div>
  )
}

export default DrugImpactSimulator
