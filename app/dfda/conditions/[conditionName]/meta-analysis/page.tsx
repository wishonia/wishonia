import { ConditionMetaAnalysis } from './components/ConditionMetaAnalysis'

interface PageProps {
  params: {
    treatmentName: string
    conditionName: string
  }
}

export default function TreatmentForConditionPage({ params }: PageProps) {
  const conditionName = decodeURIComponent(params.conditionName)
  
  return <ConditionMetaAnalysis conditionName={conditionName} />
}