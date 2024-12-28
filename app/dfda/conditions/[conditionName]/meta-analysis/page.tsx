import { DFDABreadcrumbs } from '@/components/Breadcrumbs/DFDABreadcrumbs'

import { ConditionMetaAnalysis } from './components/ConditionMetaAnalysis'

interface PageProps {
  params: {
    treatmentName: string
    conditionName: string
  }
}

export default function TreatmentForConditionPage({ params }: PageProps) {
  const conditionName = decodeURIComponent(params.conditionName)
  
  return (
    <div className="container mx-auto p-4">
      <DFDABreadcrumbs dynamicValues={{ 
        conditionName
      }} />
      <ConditionMetaAnalysis conditionName={conditionName} />
    </div>
  )
}