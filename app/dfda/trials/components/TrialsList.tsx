"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import React from "react"

import { ListStudiesRequest, Study } from "../../lib/clinical-trials-gov"

interface TrialsListProps {
  searchParams: Partial<ListStudiesRequest>
  trialsData: {
    studies: Study[]
    totalCount: number
    nextPageToken?: string
  }
}

export default function TrialsList({ trialsData }: TrialsListProps) {
  const { studies, totalCount } = trialsData
  const [expandedSummaries, setExpandedSummaries] = React.useState<
    Record<string, boolean>
  >({})

  const toggleSummary = (nctId: string) => {
    setExpandedSummaries((prev) => ({
      ...prev,
      [nctId]: !prev[nctId],
    }))
  }

  const handleJoinTrial = (nctId: string) => {
    window.open(`https://clinicaltrials.gov/study/${nctId}`, "_blank")
  }

  if (studies.length === 0) {
    return (
      <div className="rounded-xl border-4 border-black bg-white p-6 text-center font-bold shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        No trials found matching your criteria
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-lg font-bold">
        Found {totalCount} matching trials
      </div>

      {studies.map((study, index) => {
        const nctId = study.protocolSection?.identificationModule?.nctId
        const briefTitle =
          study.protocolSection?.identificationModule?.briefTitle
        const phase = study.protocolSection?.designModule?.phases?.[0] || "N/A"
        const briefSummary =
          study.protocolSection?.descriptionModule?.briefSummary
        const overallStatus = study.protocolSection?.statusModule?.overallStatus
        const facility =
          study.protocolSection?.contactsLocationsModule?.locations?.[0]
            ?.facility
        const startDate =
          study.protocolSection?.statusModule?.startDateStruct?.date
        const interventions =
          study.protocolSection?.armsInterventionsModule?.interventions

        if (!nctId) return null

        return (
          <motion.div
            key={nctId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-xl border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-2xl font-black">
                {briefTitle || "Untitled Study"}
              </h3>
              <span className="rounded-full bg-green-100 px-4 py-1 font-bold text-green-800">
                {phase}
              </span>
            </div>

            <div className="mb-4">
              <p className="font-bold text-gray-700">
                {expandedSummaries[nctId]
                  ? briefSummary || "No summary available"
                  : briefSummary
                    ? `${briefSummary.slice(0, 75)}...`
                    : "No summary available"}
              </p>
              {briefSummary && briefSummary.length > 75 && (
                <button
                  onClick={() => toggleSummary(nctId)}
                  className="mt-2 text-sm font-bold text-blue-600 hover:underline"
                >
                  {expandedSummaries[nctId] ? "Show Less" : "Show More"}
                </button>
              )}
            </div>

            <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
              <div>
                <p className="text-sm font-bold text-gray-500">Status</p>
                <p className="font-bold text-blue-600">
                  {overallStatus
                    ?.split("_")
                    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
                    .join(" ") || "Unknown"}
                </p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-500">Location</p>
                <p className="font-bold">{facility || "Multiple Locations"}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-500">Start Date</p>
                <p className="font-bold">{startDate || "TBD"}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-500">Trial ID</p>
                <p className="font-bold">{nctId}</p>
              </div>
            </div>

            {interventions && interventions.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-bold text-gray-500">
                  Treatments Being Tested
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {interventions.map((intervention, i) => (
                    <Link
                      key={i}
                      href={`/dfda/treatments/${intervention.name}`}
                      className="rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-800 transition-colors hover:bg-blue-200"
                    >
                      {intervention.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => handleJoinTrial(nctId)}
              className="group flex w-full items-center justify-center gap-2 rounded-xl border-4 border-black bg-green-400 px-6 py-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
            >
              Learn More & Join Trial
              <ArrowRight className="transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        )
      })}
    </div>
  )
}