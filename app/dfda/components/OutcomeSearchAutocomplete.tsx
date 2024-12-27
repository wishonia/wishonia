'use client'

import { GlobalVariable } from '@/types/models/GlobalVariable'

import VariableSearchAutocomplete from './VariableSearchAutocomplete'

interface OutcomeSearchAutocompleteProps {
  onVariableSelect: (outcome: GlobalVariable) => void
}

export default function OutcomeSearchAutocomplete({ onVariableSelect }: OutcomeSearchAutocompleteProps) {
  return (
    <VariableSearchAutocomplete
      onVariableSelect={onVariableSelect}
      searchParams={{ 
        outcome: '1',
        sort: '-numberOfCorrelationsAsEffect'
      }}
      placeholder="Enter condition or outcome 💊"
    />
  )
}