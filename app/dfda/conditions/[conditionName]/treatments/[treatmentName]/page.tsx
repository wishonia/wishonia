import { DFDABreadcrumbs } from '@/components/Breadcrumbs/DFDABreadcrumbs'

import { ConditionTreatmentMetaAnalysis } from './components/ConditionTreatmentMetaAnalysis'

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
      <DFDABreadcrumbs dynamicValues={{ 
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