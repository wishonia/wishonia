import { ConditionTreatmentContent } from './components/ConditionTreatmentContent'

interface PageProps {
  params: {
    treatmentName: string
    conditionName: string
  }
}

export default function TreatmentForConditionPage({ params }: PageProps) {
  const treatmentName = decodeURIComponent(params.treatmentName)
  const conditionName = decodeURIComponent(params.conditionName)
  
  return <ConditionTreatmentContent treatmentName={treatmentName} conditionName={conditionName} />
}