import { TreatmentContent } from './components/TreatmentContent'

export default function TreatmentPage({ params }: { params: { treatmentName: string } }) {
  const treatmentName = decodeURIComponent(params.treatmentName)
  
  return (
    <div className="container mx-auto px-4 py-8">
      <TreatmentContent treatmentName={treatmentName} />
    </div>
  )
}