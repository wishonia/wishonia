'use client'

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
        className="neobrutalist-container !p-3 !shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold 
          hover:!translate-x-1 hover:!translate-y-1 hover:!shadow-none focus-visible:ring-0 
          focus-visible:ring-offset-0"
      />
      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-2 neobrutalist-container !p-0 max-h-60 overflow-auto">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="px-4 py-3 hover:bg-[#FF3366] hover:text-white cursor-pointer font-bold 
                border-b-2 border-black last:border-b-0 transition-colors"
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