'use client'

import { GlobalVariable } from '@/types/models/GlobalVariable'
import VariableSearchAutocomplete from './VariableSearchAutocomplete'

interface PredictorSearchAutocompleteProps {
  onVariableSelect: (outcome: GlobalVariable) => void
}

export default function PredictorSearchAutocomplete({ onVariableSelect }: PredictorSearchAutocompleteProps) {
  return (
    <VariableSearchAutocomplete
      onVariableSelect={onVariableSelect}
      searchParams={{ 
        sort: '-numberOfCorrelationsAsCause',
        public: '1'
      }}
      placeholder="Enter food or drug 💊"
    />
  )
}