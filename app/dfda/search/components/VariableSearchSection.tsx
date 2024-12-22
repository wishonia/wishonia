'use client'

import { useRouter } from 'next/navigation'
import { GlobalVariable } from '@/types/models/GlobalVariable'
import VariableSearchAutocomplete from '../../components/VariableSearchAutocomplete'

export default function VariableSearchSection() {
  const router = useRouter()
  
  const handleVariableSelect = (variable: GlobalVariable) => {
    router.push(`/dfda/globalVariables/${variable.variableId}`)
  }

  return (
    <div className="neobrutalist-gradient-container neobrutalist-gradient-green">
      <h2 className="neobrutalist-title">Search for a Condition, Symptom, Food, Supplement, or Drug</h2>
      <VariableSearchAutocomplete
        onVariableSelect={handleVariableSelect}
        searchParams={{ variableCategoryName: 'Anything' }}
        placeholder="Search here..."
      />
    </div>
  )
} 