'use client'

import Image from 'next/image'

import { Study } from '@/types/models/Study'

interface StudyHeaderHtmlProps {
  study: Study
}

export default function StudyHeaderHtml({ study }: StudyHeaderHtmlProps) {
  return (
    <div className="neobrutalist-container bg-white p-6 text-center">
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="neobrutalist-h1">
          {study.studyText?.studyTitle}
        </h1>
      </div>

      {/* Images Section */}
      <div className="flex items-center justify-around max-w-4xl mx-auto mb-8">
        {/* Cause Variable Image */}
        <div className="w-1/6 relative">
          <div className="relative w-24 h-24 md:w-32 md:h-32">
            <Image
              src={study.causeVariable?.imageUrl || '/placeholder-variable.png'}
              alt={`${study.causeVariableName} image`}
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Gauge Image */}
        <div className="w-2/3 relative">
          <div className="relative h-40 md:h-48">
            {study.studyImages?.gaugeImage ? (
              <Image
                src={study.studyImages.gaugeImage}
                alt="Study gauge"
                fill
                className="object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-4xl font-bold">
                  {study.causeVariableName} → {study.effectVariableName}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Effect Variable Image */}
        <div className="w-1/6 relative">
          <div className="relative w-24 h-24 md:w-32 md:h-32">
            <Image
              src={study.effectVariable?.imageUrl || '/placeholder-variable.png'}
              alt={`${study.effectVariableName} image`}
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Tagline */}
      {study.studyText?.tagLine && (
        <div className="text-2xl font-bold py-5 px-4 text-center max-w-3xl mx-auto">
          {study.studyText.tagLine}
        </div>
      )}
    </div>
  )
} 