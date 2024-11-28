'use client'

import { Study } from '@/types/models/Study'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Highcharts from "highcharts"
import { useRouter } from 'next/navigation'
import DOMPurify from 'isomorphic-dompurify'
import { GlobalVariableCharts } from '@/components/globalVariables/global-variable-charts'
import HighchartsReact from 'highcharts-react-official'
import StudyHeaderHtml from './StudyHeaderHtml'

interface StudyCardProps {
  study: Study
}

export default function StudyCard({ study }: StudyCardProps) {
  const router = useRouter()

  const renderStatistics = () => {
    if (!study.statistics) return null

    return (
      <div className="neobrutalist-container bg-white p-6 mb-8">
        <h2 className="neobrutalist-h2 mb-6">Quick Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {study.statistics.correlationCoefficient && (
            <div className="neobrutalist-container bg-gray-50 p-4">
              <span className="font-bold">Correlation Coefficient</span>
              <br />
              <span>{study.statistics.correlationCoefficient}</span>
            </div>
          )}
          {study.statistics.statisticalSignificance && (
            <div className="neobrutalist-container bg-gray-50 p-4">
              <span className="font-bold">Statistical Significance</span>
              <br />
              <span>{study.statistics.statisticalSignificance}</span>
            </div>
          )}
          {study.statistics.numberOfPairs && (
            <div className="neobrutalist-container bg-gray-50 p-4">
              <span className="font-bold">Number of Pairs</span>
              <br />
              <span>{study.statistics.numberOfPairs}</span>
            </div>
          )}
          {study.statistics.pValue && (
            <div className="neobrutalist-container bg-gray-50 p-4">
              <span className="font-bold">P Value</span>
              <br />
              <span>{study.statistics.pValue}</span>
            </div>
          )}
          {study.statistics.tValue && (
            <div className="neobrutalist-container bg-gray-50 p-4">
              <span className="font-bold">T Value</span>
              <br />
              <span>{study.statistics.tValue}</span>
            </div>
          )}
          {study.statistics.confidenceInterval && (
            <div className="neobrutalist-container bg-gray-50 p-4">
              <span className="font-bold">Confidence Interval</span>
              <br />
              <span>{study.statistics.confidenceInterval}</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  const sanitizeHtml = (html: string) => {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'li', 'ol'],
      ALLOWED_ATTR: ['href', 'target', 'rel']
    })
  }

  return (
    <div className="neobrutalist-gradient-container neobrutalist-gradient-pink max-w-4xl mx-auto">
      <StudyHeaderHtml study={study} />

      {/* Study Text */}
      <div className="neobrutalist-container bg-white p-6 mb-8">

        {study.studyText?.studyBackground && (
          <div className="mb-6">
            <h3 className="neobrutalist-h3 mb-2">Background</h3>
            <p className="neobrutalist-p">
              {study.studyText.studyBackground}
            </p>
          </div>
        )}

        {study.studyText?.studyObjective && (
          <div className="mb-6">
            <h3 className="neobrutalist-h3 mb-2">Objective</h3>
            <p className="neobrutalist-p">
              {study.studyText.studyObjective}
            </p>
          </div>
        )}



        {study.studyText?.studyAbstract && (
          <div className="neobrutalist-container bg-gray-50 p-4 mb-6">
            <h3 className="neobrutalist-h3 mb-2">Abstract</h3>
            <p className="neobrutalist-p">
            <div 
              className="neobrutalist-p prose prose-stone max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: sanitizeHtml(study.studyText.studyAbstract)
              }} 
            />
            </p>
          </div>
        )}

        {study.studyText?.studyResults && (
          <div className="neobrutalist-container bg-white p-4 mb-6">
            <h3 className="neobrutalist-h3 mb-2">Results</h3>
            <p className="neobrutalist-p">
            <div 
              className="neobrutalist-p prose prose-stone max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: sanitizeHtml(study.studyText.studyResults)
              }} 
            />
            </p>
          </div>
        )}

        {study.studyText?.studyLimitations && (
          <div className="mb-6">
            <h3 className="neobrutalist-h3 mb-2">Limitations</h3>
            <div 
              className="neobrutalist-p prose prose-stone max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: sanitizeHtml(study.studyText.studyLimitations)
              }} 
            />
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
            <div 
              className="neobrutalist-p prose prose-stone max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: sanitizeHtml(study.studyText.dataAnalysis)
              }} 
            />
          </div>
        )}

        {study.studyText?.dataSources && (
          <div className="neobrutalist-container bg-yellow-50 p-4 mb-6">
            <h3 className="neobrutalist-h3 mb-2">Data Sources</h3>
            <div 
              className="neobrutalist-p prose prose-stone max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: sanitizeHtml(study.studyText.dataSources)
              }} 
            />
          </div>
        )}

        {study.studyText?.participantInstructions && (
          <div className="neobrutalist-container bg-yellow-50 p-4 mb-6">
            <h3 className="neobrutalist-h3 mb-2">How to Participate</h3>
            <div 
              className="neobrutalist-p prose prose-stone max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: sanitizeHtml(study.studyText.participantInstructions)
              }} 
            />
          </div>
        )}
      </div>

      {/* Statistics */}
      {renderStatistics()}

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
      {study.studyCharts && study.studyCharts.correlationScatterPlot && (
        <div className="neobrutalist-container bg-white p-6 mb-8">
          <h2 className="neobrutalist-h2 mb-6">Study Data</h2>
          <div className="grid grid-cols-1 gap-8">
            {study.studyCharts.correlationScatterPlot && (
                <HighchartsReact
                highcharts={Highcharts}
                options={
                    study.studyCharts.correlationScatterPlot.highchartConfig
                }
            />
            )}
            {study.studyCharts.pairsOverTimeLineChart && (
              <div className="neobrutalist-container bg-gray-50 p-4">
                <h3 className="neobrutalist-h3 mb-4">Data Over Time</h3>
                <div dangerouslySetInnerHTML={{ 
                  __html: study.studyCharts.pairsOverTimeLineChart.svg || '' 
                }} />
              </div>
            )}
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