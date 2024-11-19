'use client'

import React from 'react'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface Study {
  protocolSection: {
    identificationModule: {
      nctId: string
      briefTitle: string
    }
    statusModule: {
      overallStatus: string
      startDate?: string
    }
    descriptionModule: {
      briefSummary?: string
    }
    designModule: {
      phase?: string
    }
    armsInterventionsModule?: {
      interventions?: Array<{
        name: string
        type: string
      }>
    }
    contactsLocationsModule?: {
      locations?: Array<{
        facility: string
        city: string
        state: string
        country: string
      }>
    }
  }
}

interface TrialsListProps {
  searchParams: Record<string, string>
  trialsData: {
    studies: Study[]
    totalCount: number
    nextPageToken?: string
  }
}

export default function TrialsList({ trialsData }: TrialsListProps) {
  const { studies, totalCount } = trialsData
  const [expandedSummaries, setExpandedSummaries] = React.useState<Record<string, boolean>>({})

  const toggleSummary = (nctId: string) => {
    setExpandedSummaries(prev => ({
      ...prev,
      [nctId]: !prev[nctId]
    }))
  }

  const handleJoinTrial = (nctId: string) => {
    window.open(`https://clinicaltrials.gov/study/${nctId}`, '_blank')
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
      
      {studies.map((study, index) => (
        <motion.div
          key={study.protocolSection.identificationModule.nctId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="rounded-xl border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-2xl font-black">{study.protocolSection.identificationModule.briefTitle}</h3>
            <span className="rounded-full bg-green-100 px-4 py-1 font-bold text-green-800">
              {study.protocolSection.designModule?.phase || 'N/A'}
            </span>
          </div>
          
          <div className="mb-4">
            <p className="font-bold text-gray-700">
              {expandedSummaries[study.protocolSection.identificationModule.nctId]
                ? study.protocolSection.descriptionModule?.briefSummary || 'No summary available'
                : study.protocolSection.descriptionModule?.briefSummary?.slice(0, 75) + '...' || 'No summary available'}
            </p>
            {(study.protocolSection.descriptionModule?.briefSummary?.length || 0) > 75 && (
              <button
                onClick={() => toggleSummary(study.protocolSection.identificationModule.nctId)}
                className="mt-2 text-sm font-bold text-blue-600 hover:underline"
              >
                {expandedSummaries[study.protocolSection.identificationModule.nctId] ? 'Show Less' : 'Show More'}
              </button>
            )}
          </div>
          
          <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <p className="text-sm font-bold text-gray-500">Status</p>
              <p className="font-bold text-blue-600">{study.protocolSection.statusModule.overallStatus.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500">Location</p>
              <p className="font-bold">
                {study.protocolSection.contactsLocationsModule?.locations?.[0]?.facility || 'Multiple Locations'}
              </p>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500">Start Date</p>
              <p className="font-bold">{study.protocolSection.statusModule.startDate || 'TBD'}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500">Trial ID</p>
              <p className="font-bold">{study.protocolSection.identificationModule.nctId}</p>
            </div>
          </div>

          {study.protocolSection.armsInterventionsModule?.interventions && (
            <div className="mb-4">
              <p className="text-sm font-bold text-gray-500">Treatments Being Tested</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {study.protocolSection.armsInterventionsModule.interventions.map((intervention, i) => (
                  <Link
                    key={i}
                    href={`/dfda/treatments/${intervention.name}`}
                    className="rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-800 hover:bg-blue-200 transition-colors"
                  >
                    {intervention.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => handleJoinTrial(study.protocolSection.identificationModule.nctId)}
            className="group flex w-full items-center justify-center gap-2 rounded-xl border-4 border-black bg-green-400 px-6 py-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
          >
            Learn More & Join Trial
            <ArrowRight className="transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>
      ))}
    </div>
  )
} 