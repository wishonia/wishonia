"use client"

import React, { useEffect, useState } from "react"
import { HelpCircle } from "lucide-react"
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

interface DrugImpactProfile {
  name: string
  qalyGainedTreatment: number
  dalyAvoidedTreatment: number
  qalyLostSideEffects: number
  dalyInducedSideEffects: number
  qalyLostAddiction: number
  dalyInducedAddiction: number
  qalyGainedRecreational: number
  dalyAvoidedRecreational: number
  netQALY?: number
  netDALY?: number
}

const fieldDescriptions: Record<keyof DrugImpactProfile, string> = {
  name: "Name of the drug being evaluated",
  qalyGainedTreatment: "QALYs gained from the drug's intended medical use",
  dalyAvoidedTreatment: "DALYs avoided due to the drug's treatment effects",
  qalyLostSideEffects: "QALYs lost due to side effects",
  dalyInducedSideEffects: "DALYs induced by side effects",
  qalyLostAddiction: "QALYs lost due to addiction or dependence",
  dalyInducedAddiction: "DALYs induced by addiction or dependence",
  qalyGainedRecreational: "QALYs gained from recreational use (if applicable)",
  dalyAvoidedRecreational:
    "DALYs avoided from recreational use (if applicable)",
  netQALY: "Net QALYs (gained minus lost)",
  netDALY: "Net DALYs (avoided minus induced)",
}

const DrugImpactSimulator: React.FC = () => {
  const [formData, setFormData] = useState<DrugImpactProfile>({
    name: "Example Drug",
    qalyGainedTreatment: 1000,
    dalyAvoidedTreatment: 800,
    qalyLostSideEffects: 100,
    dalyInducedSideEffects: 150,
    qalyLostAddiction: 200,
    dalyInducedAddiction: 250,
    qalyGainedRecreational: 50,
    dalyAvoidedRecreational: 30,
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

  useEffect(() => {
    const calculateNetImpact = (
      data: DrugImpactProfile
    ): Partial<DrugImpactProfile> => {
      const netQALY =
        data.qalyGainedTreatment +
        data.qalyGainedRecreational -
        data.qalyLostSideEffects -
        data.qalyLostAddiction

      const netDALY =
        data.dalyAvoidedTreatment +
        data.dalyAvoidedRecreational -
        data.dalyInducedSideEffects -
        data.dalyInducedAddiction

      return { netQALY, netDALY }
    }

    setFormData((prevData) => ({
      ...prevData,
      ...calculateNetImpact(prevData),
    }))
  }, [
    formData.qalyGainedTreatment,
    formData.dalyAvoidedTreatment,
    formData.qalyLostSideEffects,
    formData.dalyInducedSideEffects,
    formData.qalyLostAddiction,
    formData.dalyInducedAddiction,
    formData.qalyGainedRecreational,
    formData.dalyAvoidedRecreational,
  ])

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
    { name: "Net QALY", value: formData.netQALY },
    { name: "Net DALY", value: formData.netDALY },
  ]

  return (
    <div className="mx-auto w-full max-w-4xl bg-gradient-to-b from-green-100 to-blue-100 p-8 font-sans">
      <h2 className="mb-8 rounded-lg bg-gradient-to-r from-green-600 to-blue-600 p-4 text-center text-4xl font-bold text-white shadow-lg">
        DRUG IMPACT SIMULATOR
      </h2>
      <div className="mb-8 rounded-lg bg-white p-6 shadow-lg">
        <h3 className="mb-4 rounded bg-gradient-to-r from-green-500 to-blue-500 p-2 text-2xl font-bold text-white">
          {formData.name.toUpperCase()}
        </h3>
        <form className="space-y-6">
          <div className="border-b-2 border-gray-200 pb-4">
            <label htmlFor="name" className="text-lg font-bold">
              Drug Name
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
            .filter((key) => !["name", "netQALY", "netDALY"].includes(key))
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
                    {key
                      .split(/(?=[A-Z])/)
                      .join(" ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
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
                    {fieldDescriptions[key]}
                  </div>
                )}
              </div>
            ))}
        </form>
      </div>
      <div className="mb-8 rounded-lg bg-white p-6 shadow-lg">
        <h3 className="mb-4 rounded bg-gradient-to-r from-green-500 to-blue-500 p-2 text-2xl font-bold text-white">
          NET IMPACT
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div
            className={`rounded-lg border-4 p-4 ${formData.netQALY && formData.netQALY > 0 ? "border-green-500 bg-green-100" : "border-red-500 bg-red-100"}`}
          >
            <h4 className="font-bold">NET QALY</h4>
            <p className="text-2xl">{formData.netQALY?.toFixed(2)}</p>
          </div>
          <div
            className={`rounded-lg border-4 p-4 ${formData.netDALY && formData.netDALY > 0 ? "border-green-500 bg-green-100" : "border-red-500 bg-red-100"}`}
          >
            <h4 className="font-bold">NET DALY</h4>
            <p className="text-2xl">{formData.netDALY?.toFixed(2)}</p>
          </div>
        </div>
        <div className="mt-8">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h3 className="mb-4 rounded bg-gradient-to-r from-green-500 to-blue-500 p-2 text-2xl font-bold text-white">
          INTERPRETATION
        </h3>
        <p className="mb-4">
          This simulator estimates the net impact of a drug in terms of
          Quality-Adjusted Life Years (QALYs) and Disability-Adjusted Life Years
          (DALYs).
        </p>
        <ul className="list-inside list-disc space-y-2">
          <li>
            Positive Net QALY indicates overall improvement in quality of life.
          </li>
          <li>
            Positive Net DALY indicates overall reduction in disease burden.
          </li>
          <li>Higher values suggest greater positive impact.</li>
          <li>
            Negative values suggest the drug may cause more harm than benefit.
          </li>
        </ul>
        <p className="mt-4">
          These metrics provide a simplified view of the drug's impact.
          Real-world decisions should consider additional factors such as
          specific patient populations, alternative treatments, and economic
          considerations.
        </p>
      </div>
    </div>
  )
}

export default DrugImpactSimulator
