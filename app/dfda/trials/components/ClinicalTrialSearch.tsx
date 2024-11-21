"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Search } from "lucide-react"

import { searchConditions } from "@/lib/clinicaltables"

export default function ClinicalTrialSearch() {
  const router = useRouter()
  const [condition, setCondition] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (condition.trim()) {
      setIsSearching(true)
      setSearchError(null)

      try {
        console.log("Starting search with condition:", condition.trim())
        const params = new URLSearchParams()
        params.set("queryCond", condition.trim())

        const searchUrl = `/dfda/trials/search?${params.toString()}`
        console.log("Navigating to:", searchUrl)

        router.push(searchUrl)
      } catch (error) {
        console.error("Search error:", error)
        setSearchError("Failed to perform search. Please try again.")
      } finally {
        setIsSearching(false)
      }
    }
  }

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCondition(value)

    if (value.trim().length > 2) {
      setLoading(true)
      try {
        const results = await searchConditions(value)
        setSuggestions(results.slice(0, 5))
      } catch (error) {
        console.error("Error fetching suggestions:", error)
      }
      setLoading(false)
    } else {
      setSuggestions([])
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setCondition(suggestion)
    setSuggestions([])
    router.push(`/trials/${encodeURIComponent(suggestion)}`)
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="relative mb-6">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-500" />
            <input
              type="text"
              placeholder="Enter your condition (e.g., Type 2 Diabetes)"
              value={condition}
              onChange={handleInputChange}
              className="w-full rounded-xl border-4 border-black bg-white px-12 py-4 text-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline-none transition-all focus:translate-x-1 focus:translate-y-1 focus:shadow-none"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className={`group flex items-center gap-2 rounded-xl border-4 border-black ${
              isSearching
                ? "cursor-not-allowed bg-gray-200"
                : "bg-white hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
            } px-6 py-4 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all`}
          >
            {isSearching ? "Searching..." : "Find Trials"}
            <ArrowRight className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Suggestions dropdown */}
        {suggestions.length > 0 && (
          <div className="absolute z-10 mt-2 w-full rounded-xl border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full border-b border-gray-200 px-4 py-3 text-left font-bold last:border-none hover:bg-gray-100"
                type="button"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Add error message */}
        {searchError && (
          <div className="mt-2 rounded-lg border-2 border-red-500 bg-red-100 p-2 text-red-700">
            {searchError}
          </div>
        )}
      </form>
    </div>
  )
}
