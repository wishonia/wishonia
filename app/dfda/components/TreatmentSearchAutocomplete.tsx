import SearchAutocomplete from './SearchAutocomplete'
import { searchDfdaTreatments } from "@/lib/clinicaltables"

interface TreatmentSearchAutocompleteProps {
  onTreatmentSelect: (treatment: string) => void
  placeholder?: string
}

export default function TreatmentSearchAutocomplete({ onTreatmentSelect, placeholder = "Enter treatment" }: TreatmentSearchAutocompleteProps) {
  return (
    <SearchAutocomplete
      onSelect={onTreatmentSelect}
      placeholder={placeholder}
      searchFunction={searchDfdaTreatments}
    />
  )
}