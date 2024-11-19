import React, { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"

interface SearchAutocompleteProps {
  onSelect: (item: string) => void
  placeholder?: string
  searchFunction: (query: string) => Promise<string[]>
  brutalist?: boolean
}

export default function SearchAutocomplete({ onSelect, placeholder, searchFunction, brutalist = false }: SearchAutocompleteProps) {
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
    <div className="relative w-full">
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className={`w-full ${
          brutalist ? "rounded-xl border-4 border-black bg-white p-4 text-xl placeholder:text-gray-500 focus:ring-4 focus:ring-blue-500" : ""
        }`}
      />
      {showDropdown && (
        <ul className={`absolute z-50 w-full mt-1 max-h-60 overflow-auto ${
          brutalist 
            ? "rounded-xl border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" 
            : "bg-background border border-input rounded-md shadow-md"
        }`}>
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`px-4 py-2 cursor-pointer ${
                brutalist
                  ? "hover:bg-gray-100 text-xl font-bold"
                  : "hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}