import React, { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { searchConditions } from "@/lib/clinicaltables"

interface ConditionSearchAutocompleteProps {
  onConditionSelect: (condition: string) => void
  placeholder?: string
}

export default function ConditionSearchAutocomplete({ onConditionSelect, placeholder = "Enter medical condition" }: ConditionSearchAutocompleteProps) {
  const [condition, setCondition] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    if (condition.length > 2) {
      searchConditions(condition).then(extractedSuggestions => {
        setSuggestions(extractedSuggestions)
        setShowDropdown(true)
      })
    } else {
      setSuggestions([])
      setShowDropdown(false)
    }
  }, [condition])

  const handleSuggestionClick = (suggestion: string) => {
    setCondition(suggestion)
    setShowDropdown(false)
    onConditionSelect(suggestion)
  }

  return (
    <div className="relative">
      <Input
        type="text"
        placeholder={placeholder}
        value={condition}
        onChange={(e) => setCondition(e.target.value)}
        className="w-full"
      />
      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full border border-gray-300 mt-1 max-h-60 overflow-auto bg-background">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}