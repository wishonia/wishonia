import React, { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"

interface SearchAutocompleteProps {
  onSelect: (item: string) => void
  placeholder?: string
  searchFunction: (query: string) => Promise<string[]>
}

export default function SearchAutocomplete({ onSelect, placeholder, searchFunction }: SearchAutocompleteProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    if (query.length > 2) {
      searchFunction(query).then(extractedSuggestions => {
        setSuggestions(extractedSuggestions)
        setShowDropdown(true)
      })
    } else {
      setSuggestions([])
      setShowDropdown(false)
    }
  }, [query, searchFunction])

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    setShowDropdown(false)
    onSelect(suggestion)
  }

  return (
    <div className="relative">
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full"
      />
      {showDropdown && (
        <ul className="absolute z-10 w-full bg-background border border-input mt-1 max-h-60 overflow-auto rounded-md shadow-md">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}