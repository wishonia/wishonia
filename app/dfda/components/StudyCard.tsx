'use client'

import { Study } from '@/types/models/Study'
import { Button } from '@/components/ui/button'
import Highcharts from "highcharts"
import { useRouter } from 'next/navigation'
import { GlobalVariableCharts } from '@/components/globalVariables/global-variable-charts'
import HighchartsReact from 'highcharts-react-official'
import StudyHeaderHtml from './StudyHeaderHtml'
import { SanitizedContent } from './SanitizedContent'
import { StudyStatistics } from './StudyStatistics'
import { Link, Twitter, Facebook, Linkedin } from 'lucide-react'

interface StudyCardProps {
  study: Study
}

export default function StudyCard({ study }: StudyCardProps) {
  const router = useRouter()

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  const handleShare = async (platform?: string) => {
    if (!platform) {
      await navigator.clipboard.writeText(shareUrl)
      return
    }

    let shareText = `Check out this ${study.type} study about ${study.effectVariableName} and ${study.causeVariableName}`
    
    if (study.statistics?.correlationCoefficient) {
      const correlation = Math.abs(study.statistics.correlationCoefficient)
      let strength = 'weak'
      if (correlation > 0.5) strength = 'strong'
      else if (correlation > 0.3) strength = 'moderate'
      
      shareText += `. Found a ${strength} ${study.statistics.correlationCoefficient > 0 ? 'positive' : 'negative'} relationship`
    }

    const shareImage = study.studyImages?.gaugeSharingImageUrl || study.studyImages?.imageUrl

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&picture=${encodeURIComponent(shareImage || '')}&quote=${encodeURIComponent(shareText)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(shareText)}${shareImage ? `&image=${encodeURIComponent(shareImage)}` : ''}`
    }

    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank')
  }

  return (
    <div className="neobrutalist-gradient-container neobrutalist-gradient-pink max-w-4xl mx-auto">
      <StudyHeaderHtml study={study} />

      {/* Share buttons */}
      <div className="flex justify-center gap-2 mb-6">
        <Button
          variant="neobrutalist"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => handleShare()}
        >
          <Link className="h-4 w-4" />
          Copy Link
        </Button>
        <Button
          variant="neobrutalist"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => handleShare('twitter')}
        >
          <Twitter className="h-4 w-4" />
          Twitter
        </Button>
        <Button
          variant="neobrutalist"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => handleShare('facebook')}
        >
          <Facebook className="h-4 w-4" />
          Facebook
        </Button>
        <Button
          variant="neobrutalist"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => handleShare('linkedin')}
        >
          <Linkedin className="h-4 w-4" />
          LinkedIn
        </Button>
      </div>

      {/* Study Text */}
      <div className="neobrutalist-container bg-white p-6 mb-8">
        {study.studyText?.studyBackground && (
          <div className="mb-6">
            <h3 className="neobrutalist-h3 mb-2">Background</h3>
            <p className="neobrutalist-p">{study.studyText.studyBackground}</p>
          </div>
        )}

        {study.studyText?.studyObjective && (
          <div className="mb-6">
            <h3 className="neobrutalist-h3 mb-2">Objective</h3>
            <p className="neobrutalist-p">{study.studyText.studyObjective}</p>
          </div>
        )}

        {study.studyText?.studyAbstract && (
          <div className="neobrutalist-container bg-gray-50 p-4 mb-6">
            <h3 className="neobrutalist-h3 mb-2">Abstract</h3>
            <SanitizedContent html={study.studyText.studyAbstract} />
          </div>
        )}

        {study.studyText?.studyResults && (
          <div className="neobrutalist-container bg-white p-4 mb-6">
            <h3 className="neobrutalist-h3 mb-2">Results</h3>
            <SanitizedContent html={study.studyText.studyResults} />
          </div>
        )}

        {study.studyText?.studyLimitations && (
          <div className="mb-6">
            <h3 className="neobrutalist-h3 mb-2">Limitations</h3>
            <SanitizedContent html={study.studyText.studyLimitations} />
          </div>
        )}

        {(study.studyText?.averageEffectFollowingHighCauseExplanation || 
          study.studyText?.averageEffectFollowingLowCauseExplanation) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {study.studyText.averageEffectFollowingHighCauseExplanation && (
              <div className="neobrutalist-container bg-green-50 p-4">
                <h4 className="neobrutalist-h4 mb-2">High Effect</h4>
                <p className="neobrutalist-p">
                  {study.studyText.averageEffectFollowingHighCauseExplanation}
                </p>
              </div>
            )}
            {study.studyText.averageEffectFollowingLowCauseExplanation && (
              <div className="neobrutalist-container bg-red-50 p-4">
                <h4 className="neobrutalist-h4 mb-2">Low Effect</h4>
                <p className="neobrutalist-p">
                  {study.studyText.averageEffectFollowingLowCauseExplanation}
                </p>
              </div>
            )}
          </div>
        )}

        {study.studyText?.dataAnalysis && (
          <div className="neobrutalist-container bg-blue-50 p-4 mb-6">
            <h3 className="neobrutalist-h3 mb-2">Data Analysis</h3>
            <SanitizedContent html={study.studyText.dataAnalysis} />
          </div>
        )}

        {study.studyText?.dataSources && (
          <div className="neobrutalist-container bg-yellow-50 p-4 mb-6">
            <h3 className="neobrutalist-h3 mb-2">Data Sources</h3>
            <SanitizedContent html={study.studyText.dataSources} />
          </div>
        )}

        {study.studyText?.participantInstructions && (
          <div className="neobrutalist-container bg-yellow-50 p-4 mb-6">
            <h3 className="neobrutalist-h3 mb-2">How to Participate</h3>
            <SanitizedContent html={study.studyText.participantInstructions} />
          </div>
        )}
      </div>

      {/* Statistics */}
      {study.statistics && <StudyStatistics statistics={study.statistics} />}

      {study.causeVariable && study.causeVariable.charts && (
        <div className="neobrutalist-container bg-white p-6 mb-8">
          <h2 className="neobrutalist-h2 mb-6">Cause Variable Data</h2>
          <GlobalVariableCharts globalVariable={study.causeVariable} />
        </div>
      )}

      {study.effectVariable && study.effectVariable.charts && (
        <div className="neobrutalist-container bg-white p-6 mb-8">
          <h2 className="neobrutalist-h2 mb-6">Effect Variable Data</h2>
          <GlobalVariableCharts globalVariable={study.effectVariable} />
        </div>
      )}

      {/* Study Charts */}
      {study.studyCharts && (
        <div className="neobrutalist-container bg-white p-6 mb-8">
          <h2 className="neobrutalist-h2 mb-6">Study Data</h2>
          <div className="grid grid-cols-1 gap-8">
            {Object.entries(study.studyCharts).map(([key, chart]) => (
              chart && chart.highchartConfig ? (
                <div key={key} className="item-text-wrap">
                  {chart.chartTitle && (
                    <h3 className="neobrutalist-h3 mb-4">{chart.chartTitle}</h3>
                  )}
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={chart.highchartConfig}
                  />
                  {chart.explanation && (
                    <p className="neobrutalist-p mt-4">{chart.explanation}</p>
                  )}
                </div>
              ) : null
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button
          variant="neobrutalist"
          size="lg"
          onClick={() => router.push(`/dfda/study/${study.id}`)}
        >
          View Full Study
        </Button>
        {study.studyLinks?.studyLinkStatic && (
          <Button
            variant="neobrutalist"
            size="lg"
            onClick={() => {
              navigator.clipboard.writeText(study.studyLinks?.studyLinkStatic ?? '')
            }}
          >
            Copy Share Link
          </Button>
        )}
      </div>
    </div>
  )
} 