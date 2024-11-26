"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"

import { GlobalVariable } from "@/types/models/GlobalVariable"
import { searchVariables } from "@/app/dfda/dfdaActions"

export function SearchAutocomplete() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<GlobalVariable[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const debounceTimeout = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (!query) {
      setSuggestions([])
      return
    }

    // Clear previous timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }

    // Set new timeout
    debounceTimeout.current = setTimeout(async () => {
      setLoading(true)
      try {
        const results = await searchVariables(query)
        setSuggestions(results)
        setIsOpen(true)
      } catch (error) {
        console.error("Failed to fetch suggestions:", error)
      } finally {
        setLoading(false)
      }
    }, 300) // 300ms debounce

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
    }
  }, [query])

  const handleSelect = (variable: GlobalVariable) => {
    setQuery(variable.name)
    setSuggestions([])
    setIsOpen(false)
    router.push(
      `/dfda/predictor-search?effectVariableName=${encodeURIComponent(variable.name)}`
    )
  }

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          placeholder="Enter anything that you want to know the most likely effects of..."
          className="w-full rounded-lg border border-white/20 bg-white/10 p-3 text-white placeholder:text-white/60 focus:border-white/40 focus:outline-none"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          </div>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 mt-1 max-h-96 w-full overflow-auto rounded-lg bg-white shadow-lg">
          {suggestions.map((variable) => (
            <button
              key={variable.id}
              onClick={() => handleSelect(variable)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-100"
            >
              {variable.imageUrl && (
                <img
                  src={variable.imageUrl}
                  alt=""
                  className="h-8 w-8 rounded object-cover"
                />
              )}
              <div>
                <div className="font-medium text-gray-900">{variable.name}</div>
                {variable.variableCategoryName && (
                  <div className="text-sm text-gray-500">
                    {variable.variableCategoryName}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
