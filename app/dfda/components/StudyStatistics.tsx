'use client'

import { Correlation } from '@/types/models/Correlation'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { InfoIcon } from 'lucide-react'

type StatisticsProps = Pick<Correlation, 
  | 'correlationCoefficient'
  | 'statisticalSignificance'
  | 'numberOfPairs'
  | 'pValue'
  | 'tValue'
  | 'confidenceInterval'
  | 'causeVariableName'
  | 'effectVariableName'
  | 'averageForwardPearsonCorrelationOverOnsetDelays'
  | 'averageReversePearsonCorrelationOverOnsetDelays'
  | 'averagePearsonCorrelationCoefficientOverOnsetDelays'
  | 'strongestPearsonCorrelationCoefficient'
  | 'qmScore'
  | 'onsetDelayInHours'
  | 'durationOfActionInHours'
  | 'causeChanges'
  | 'effectChanges'
  | 'predictsHighEffectChange'
  | 'predictsLowEffectChange'
  | 'criticalTValue'
>

interface StudyStatisticsProps {
  statistics: StatisticsProps
}

export function StudyStatistics({ statistics }: StudyStatisticsProps) {
  if (!statistics) return null

  const stats = [
    { 
      label: 'Cause Variable Name', 
      value: statistics.causeVariableName,
      explanation: 'The factor being analyzed as a potential cause or predictor'
    },
    { 
      label: 'Effect Variable Name', 
      value: statistics.effectVariableName,
      explanation: 'The outcome or symptom being analyzed for potential effects'
    },
    { 
      label: 'Predictive Correlation Coefficient', 
      value: statistics.correlationCoefficient,
      explanation: 'Indicates how strongly the cause and effect are related. Ranges from -1 to 1, where 1 means perfect positive correlation, -1 means perfect negative correlation, and 0 means no correlation'
    },
    { 
      label: 'Average Forward Correlation Over Delays', 
      value: statistics.averageForwardPearsonCorrelationOverOnsetDelays,
      explanation: 'The average correlation when looking at how the cause predicts future effects across different time delays'
    },
    { 
      label: 'Average Reverse Correlation Over Delays', 
      value: statistics.averageReversePearsonCorrelationOverOnsetDelays,
      explanation: 'The average correlation when looking at how the effect predicts past causes across different time delays. Should be lower than forward correlation for causal relationships'
    },
    { 
      label: 'Average Correlation Over All Onset Delays', 
      value: statistics.averagePearsonCorrelationCoefficientOverOnsetDelays,
      explanation: 'The average correlation across all analyzed time delays between cause and effect'
    },
    { 
      label: 'Strongest Correlation Over All Onset Delays', 
      value: statistics.strongestPearsonCorrelationCoefficient,
      explanation: 'The strongest correlation found at any time delay between cause and effect'
    },
    { 
      label: 'QuantiModo Score', 
      value: statistics.qmScore,
      explanation: 'A proprietary score (0-100) indicating the overall strength and reliability of the relationship'
    },
    { 
      label: 'Onset Delay', 
      value: statistics.onsetDelayInHours,
      suffix: ' Hours',
      explanation: 'How long it typically takes to see an effect after the cause occurs'
    },
    { 
      label: 'Duration Of Action', 
      value: statistics.durationOfActionInHours,
      suffix: ' Hours',
      explanation: 'How long the effect typically continues after the cause occurs'
    },
    { 
      label: 'Number Of Pairs', 
      value: statistics.numberOfPairs,
      explanation: 'Total number of matched cause-effect measurements used in the analysis. More pairs generally means more reliable results'
    },
    { 
      label: 'Predictor Value Changes', 
      value: statistics.causeChanges,
      explanation: 'Number of times the cause variable value changed during the study period'
    },
    { 
      label: 'Outcome Value Changes', 
      value: statistics.effectChanges,
      explanation: 'Number of times the effect variable value changed during the study period'
    },
    { 
      label: 'Statistical Significance', 
      value: statistics.statisticalSignificance,
      explanation: 'Indicates how likely the relationship is real vs due to chance. Higher values (closer to 1) indicate stronger confidence in the results'
    },
    { 
      label: 'Typical High Outcome Change from Average', 
      value: statistics.predictsHighEffectChange,
      suffix: '%',
      explanation: 'The typical percentage increase in the effect when the cause is high'
    },
    { 
      label: 'Typical Low Outcome Change from Average', 
      value: statistics.predictsLowEffectChange,
      suffix: '%',
      explanation: 'The typical percentage decrease in the effect when the cause is low'
    },
    { 
      label: 'P Value', 
      value: statistics.pValue,
      explanation: 'The probability that the relationship occurred by chance. Lower values (< 0.05) indicate statistically significant results'
    },
    { 
      label: 'T Value', 
      value: statistics.tValue,
      explanation: 'A measure of how many standard deviations the result is from zero. Higher absolute values indicate stronger relationships'
    },
    { 
      label: 'Critical T Value', 
      value: statistics.criticalTValue,
      explanation: 'The minimum T Value needed for statistical significance. If the actual T Value exceeds this, the result is significant'
    },
    { 
      label: 'Confidence Interval', 
      value: statistics.confidenceInterval,
      explanation: 'The range within which we can be 95% confident the true correlation falls'
    }
  ]

  return (
    <div className="neobrutalist-container bg-white p-6 mb-8">
      <h2 className="neobrutalist-h2 mb-6">Quick Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map(({ label, value, suffix, explanation }) => value && (
          <div key={label} className="neobrutalist-container bg-gray-50 p-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">{label}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-4 w-4 text-gray-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-sm">{explanation}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="text-lg">
              {value}{suffix || ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
} 