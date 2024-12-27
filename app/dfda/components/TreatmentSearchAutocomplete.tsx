'use client'

import { GlobalVariable } from '@/types/models/GlobalVariable'

import VariableSearchAutocomplete from './VariableSearchAutocomplete'

interface TreatmentSearchAutocompleteProps {
  onVariableSelect: (treatment: GlobalVariable) => void
}

export default function TreatmentSearchAutocomplete({ onVariableSelect }: TreatmentSearchAutocompleteProps) {
  return (
    <VariableSearchAutocomplete
      onVariableSelect={onVariableSelect}
      searchParams={{ variableCategoryName: 'Treatments' }}
      placeholder="Enter a treatment 💊"
    />
  )
}