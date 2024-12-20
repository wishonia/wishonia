'use client'

import TreatmentConditionSearchBox from '../components/TreatmentConditionReviewsSearchBox'
import ClinicalTrialSearch from '../trials/components/ClinicalTrialSearch'
import VariableSearchAutocomplete from '../components/VariableSearchAutocomplete'
import { GlobalVariable } from '@/types/models/GlobalVariable'

export default function SearchPage() {
  const handleVariableSelect = (variable: GlobalVariable) => {
    window.location.href = variable.url || `/variables/${variable.variableId}`
  }

  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      <h1 className="neobrutalist-hero-title">Search Everything 🔍</h1>

      {/* Treatments & Conditions */}
      <div className="neobrutalist-gradient-container neobrutalist-gradient-pink">
        <h2 className="neobrutalist-title">Treatments & Conditions 💊</h2>
        <TreatmentConditionSearchBox />
      </div>

      {/* Clinical Trials */}
      <div className="neobrutalist-container">
        <h2 className="neobrutalist-title">Clinical Trials 🔬</h2>
        <ClinicalTrialSearch />
      </div>

      {/* Foods & Supplements */}
      <div className="neobrutalist-gradient-container neobrutalist-gradient-green">
        <h2 className="neobrutalist-title">Foods & Supplements 🍎</h2>
        <VariableSearchAutocomplete
          onVariableSelect={handleVariableSelect}
          searchParams={{ variableCategoryName: 'Foods' }}
          placeholder="Search foods and supplements..."
        />
      </div>
    </div>
  )
}