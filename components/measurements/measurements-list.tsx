"use client"

import { FC, useEffect, useState } from "react"
import Image from "next/image"
import { format } from "date-fns"
import { Activity, Loader2, MoreVertical } from "lucide-react"
import { User } from "next-auth"

import { Measurement } from "@/types/models/Measurement"

interface MeasurementsListProps {
  user: User
  measurementsDateRange: {
    from: string
    to: string
  }
  variableId: number
}

export const MeasurementsList: FC<MeasurementsListProps> = ({
  user,
  measurementsDateRange,
  variableId,
}) => {
  const [measurements, setMeasurements] = useState<Measurement[]>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    let url = `/api/dfda/measurements`
    if (measurementsDateRange.from) {
      url += `?earliestMeasurementTime=${measurementsDateRange.from}`
    }
    if (measurementsDateRange.to) {
      url += `?latestMeasurementTime=${measurementsDateRange.to}`
    }
    if (variableId) {
      url += `&variableId=${variableId}`
    }

    fetch(url)
      .then((response) => response.json())
      .then((measurements) => {
        if (measurementsDateRange.from) {
          measurements = measurements.filter((measurement: Measurement) => {
            const measurementTime = new Date(measurement.startAt)
            const fromDate = new Date(measurementsDateRange.from)
            return measurementTime >= fromDate
          })
        }
        if (measurementsDateRange.to) {
          measurements = measurements.filter((measurement: Measurement) => {
            const measurementTime = new Date(measurement.startAt)
            const toDate = new Date(measurementsDateRange.to)
            return measurementTime <= toDate
          })
        }
        setMeasurements(measurements)

        setIsLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching user variables:", error)
        setIsLoading(false)
      })
  }, [user, measurementsDateRange.from, measurementsDateRange.to, variableId])

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin text-4xl" />
      </div>
    )
  }

  if (!measurements?.length) {
    return <div className="p-8 text-center">No measurements found.</div>
  }

  return (
    <div className="space-y-4">
      {measurements.map((measurement, index) => (
        <div
          key={index}
          className="flex items-center gap-4 rounded-lg border bg-white p-4 shadow-sm"
        >
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center overflow-hidden">
              {measurement.pngPath ? (
                <Image
                  src={measurement.pngPath}
                  alt={measurement.variableName}
                  width={20}
                  height={20}
                  className="h-10 w-10 object-contain"
                />
              ) : (
                <Activity className="h-5 w-5 text-blue-600" />
              )}
            </div>
          </div>
          <div className="min-w-0 flex-grow">
            <div className="flex items-baseline gap-2">
              <div className="flex min-w-[100px] items-baseline gap-1 text-lg font-semibold">
                {measurement.displayValueAndUnitString}{" "}
                {measurement.variableName}
              </div>
            </div>
            <div className="mt-1 text-sm text-gray-500">
              {format(new Date(measurement.startAt), "MMM d, yyyy h:mm a")}
            </div>
            {measurement.note && (
              <div className="mt-1 truncate text-sm text-gray-600">
                {measurement.note}
              </div>
            )}
          </div>
          <button className="flex-shrink-0 text-gray-400 hover:text-gray-500">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      ))}
    </div>
  )
}
