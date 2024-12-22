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
    console.log("Selected variable:", variable)
    setQuery(variable.name)
    setSuggestions([])
    setIsOpen(false)
    const searchPath = `/dfda/predictor-search?effectVariableName=${encodeURIComponent(variable.name)}`
    console.log("Navigating to:", searchPath)
    router.push(searchPath)
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
          className="w-full rounded-xl border-4 border-black bg-white p-4 text-black 
            placeholder:text-black/60 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
            transition-all focus:translate-x-1 focus:translate-y-1 focus:shadow-none
            focus:outline-none"
        />
        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="neobrutalist-loading-spinner border-black" />
          </div>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 mt-2 max-h-96 w-full overflow-auto rounded-xl 
          border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          {suggestions.map((variable) => (
            <button
              key={variable.id}
              onClick={() => handleSelect(variable)}
              className="flex w-full items-center gap-3 border-b-4 border-black 
                last:border-b-0 px-4 py-3 text-left transition-all hover:bg-[#FF3366] 
                hover:text-white"
            >
              {variable.imageUrl && (
                <img
                  src={variable.imageUrl}
                  alt=""
                  className="h-10 w-10 rounded-lg border-2 border-black object-cover"
                />
              )}
              <div>
                <div className="font-black">{variable.name}</div>
                {variable.variableCategoryName && (
                  <div className="font-bold opacity-80">
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
