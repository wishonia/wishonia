import { ConditionTreatmentMetaAnalysis } from './components/ConditionTreatmentMetaAnalysis'
import { Breadcrumbs } from '@/components/Breadcrumbs/Breadcrumbs'

interface PageProps {
  params: {
    treatmentName: string
    conditionName: string
  }
}

export default function TreatmentForConditionPage({ params }: PageProps) {
  const treatmentName = decodeURIComponent(params.treatmentName)
  const conditionName = decodeURIComponent(params.conditionName)
  
  return (
    <div>
      <Breadcrumbs dynamicValues={{ 
        conditionName,
        treatmentName 
      }} />
      <ConditionTreatmentMetaAnalysis 
        treatmentName={treatmentName} 
        conditionName={conditionName} 
      />
    </div>
  )
}