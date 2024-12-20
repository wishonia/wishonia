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
  
  return <ConditionTreatmentMetaAnalysis treatmentName={treatmentName} conditionName={conditionName} />
}