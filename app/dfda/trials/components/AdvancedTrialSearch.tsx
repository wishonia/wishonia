"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight, ChevronDown, Search } from "lucide-react"

import { searchConditions } from "@/lib/clinicaltables"

import { ListStudiesRequest } from "../../lib/clinical-trials-gov"

interface SearchFilters
  extends Pick<
    ListStudiesRequest,
    | "queryCond"
    | "queryTerm"
    | "queryIntr"
    | "queryTitles"
    | "queryOutc"
    | "querySpons"
    | "queryLead"
    | "queryId"
    | "filterGeo"
    | "filterAdvanced"
    | "filterOverallStatus"
    | "pageToken"
  > {
  sex?: "all" | "male" | "female"
  ageRange?: {
    min?: number
    max?: number
  }
  phase?: string[]
  studyType?: string[]
  zipCode?: string
  distance?: string
  status?: string
  dateRanges?: {
    [K in DateRangeKey]?: { from?: string; to?: string }
  }
}

type DateRangeKey =
  | "studyStart"
  | "primaryCompletion"
  | "firstPosted"
  | "resultsFirstPosted"
  | "lastUpdatePosted"
  | "studyCompletion"

const inputStyles =
  "w-full rounded-xl border-4 border-black bg-white px-12 py-4 text-lg font-bold text-black placeholder:text-gray-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline-none transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none"

const suggestionButtonStyles =
  "w-full border-b-4 border-black px-4 py-3 text-left font-bold text-black transition-colors hover:bg-yellow-200 last:border-none"

const numberInputStyles =
  "w-24 rounded-xl border-4 border-black bg-white px-3 py-2 text-black placeholder:text-gray-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"

const selectStyles =
  "rounded-xl border-4 border-black bg-white px-3 py-2 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"

const zipInputStyles =
  "w-32 rounded-xl border-4 border-black bg-white px-3 py-2 text-black placeholder:text-gray-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"

interface AdvancedTrialSearchProps {
  initialFilters?: Partial<SearchFilters>
}

export default function AdvancedTrialSearch({
  initialFilters,
}: AdvancedTrialSearchProps) {
  const router = useRouter()
  const [condition, setCondition] = useState(initialFilters?.queryCond || "")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  // Initialize all filter fields with default values
  const [filters, setFilters] = useState<SearchFilters>({
    // API fields
    queryCond: initialFilters?.queryCond || "",
    queryTerm: initialFilters?.queryTerm || "",
    queryIntr: initialFilters?.queryIntr || "",
    queryTitles: initialFilters?.queryTitles || "",
    queryOutc: initialFilters?.queryOutc || "",
    querySpons: initialFilters?.querySpons || "",
    queryLead: initialFilters?.queryLead || "",
    queryId: initialFilters?.queryId || "",
    filterGeo: initialFilters?.filterGeo || "",
    filterAdvanced: initialFilters?.filterAdvanced || "",
    filterOverallStatus: initialFilters?.filterOverallStatus || ["RECRUITING"],
    pageToken: initialFilters?.pageToken || "",

    // UI-specific fields
    sex: initialFilters?.sex || "all",
    ageRange: initialFilters?.ageRange || { min: undefined, max: undefined },
    phase: initialFilters?.phase || [],
    studyType: initialFilters?.studyType || [],
    zipCode: initialFilters?.zipCode || "",
    distance: initialFilters?.distance || "",
    status: initialFilters?.status?.[0] || "Recruiting",
    dateRanges: initialFilters?.dateRanges || {},
  })

  const dateRangeFields: Array<{ key: DateRangeKey; label: string }> = [
    { key: "studyStart", label: "Study Start" },
    { key: "primaryCompletion", label: "Primary Completion" },
    { key: "firstPosted", label: "First Posted" },
    { key: "resultsFirstPosted", label: "Results First Posted" },
    { key: "lastUpdatePosted", label: "Last Update Posted" },
    { key: "studyCompletion", label: "Study Completion" },
  ]

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault()

    setIsSearching(true)
    setSearchError(null)

    try {
      console.log("Starting search with filters:", filters)

      const queryParams = new URLSearchParams()

      // Basic search parameters
      if (condition) queryParams.set("queryCond", condition)
      if (filters.queryTerm) queryParams.set("queryTerm", filters.queryTerm)
      if (filters.queryIntr) queryParams.set("queryIntr", filters.queryIntr)
      if (filters.queryTitles)
        queryParams.set("queryTitles", filters.queryTitles)
      if (filters.queryOutc) queryParams.set("queryOutc", filters.queryOutc)
      if (filters.querySpons) queryParams.set("querySpons", filters.querySpons)
      if (filters.queryLead) queryParams.set("queryLead", filters.queryLead)
      if (filters.queryId) queryParams.set("queryId", filters.queryId)

      // Build advanced filters string
      const advancedFilters: string[] = []

      // Sex filter
      if (filters.sex && filters.sex !== "all") {
        advancedFilters.push(`sex:${filters.sex}`)
      }

      // Phase filter
      if (filters.phase?.length) {
        advancedFilters.push(
          `phase:${filters.phase.map((p) => p.replace("Phase ", "")).join(",")}`
        )
      }

      // Study type filter
      if (filters.studyType?.length) {
        const typeMap: Record<string, string> = {
          Interventional: "int",
          Observational: "obs",
          "Patient Registry": "pat_reg",
        }
        const types = filters.studyType
          .map((t) => typeMap[t] || t.toLowerCase())
          .join(",")
        advancedFilters.push(`studyType:${types}`)
      }

      // Status filter
      if (filters.status && filters.status !== "All studies") {
        const statusMap: Record<string, string> = {
          Recruiting: "RECRUITING",
          "Not yet recruiting": "NOT_YET_RECRUITING",
          "Active, not recruiting": "ACTIVE_NOT_RECRUITING",
          Completed: "COMPLETED",
          "Enrolling by invitation": "ENROLLING_BY_INVITATION",
        }
        const status = statusMap[filters.status] || filters.status.toUpperCase()
        queryParams.set("filterOverallStatus", status)
      }

      // Location filter
      if (filters.zipCode && filters.distance) {
        queryParams.set("locStr", filters.zipCode)
        queryParams.set("distance", filters.distance)
      }

      // Age range filter
      if (filters.ageRange?.min || filters.ageRange?.max) {
        queryParams.set(
          "ageRange",
          `${filters.ageRange.min || ""}y_${filters.ageRange.max || ""}y`
        )
      }

      // Date ranges
      if (filters.dateRanges) {
        Object.entries(filters.dateRanges).forEach(([key, range]) => {
          if (range?.from || range?.to) {
            const paramKey = (() => {
              switch (key) {
                case "studyStart":
                  return "start"
                case "primaryCompletion":
                  return "primComp"
                case "firstPosted":
                  return "firstPost"
                case "resultsFirstPosted":
                  return "resFirstPost"
                case "lastUpdatePosted":
                  return "lastUpdPost"
                case "studyCompletion":
                  return "studyComp"
                default:
                  return key
              }
            })()
            queryParams.set(paramKey, `${range.from || ""}_${range.to || ""}`)
          }
        })
      }

      // Add advanced filters to URL if any exist
      if (advancedFilters.length > 0) {
        queryParams.set("filterAdvanced", advancedFilters.join(","))
      }

      const searchUrl = `/dfda/trials/search?${queryParams.toString()}`
      console.log("Navigating to:", searchUrl)

      router.push(searchUrl)
      setShowFilters(false) // Close advanced filters after search
    } catch (error) {
      console.error("Search error:", error)
      setSearchError("Failed to perform search. Please try again.")
    } finally {
      setIsSearching(false)
    }
  }

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCondition(value)

    // Removed the character length limitation
    setLoading(true)
    try {
      const results = await searchConditions(value)
      setSuggestions(results.slice(0, 5))
    } catch (error) {
      console.error("Error fetching suggestions:", error)
    }
    setLoading(false)
  }

  const handleInputFocus = async () => {
    // Fetch default suggestions when the input is focused
    setLoading(true)
    try {
      const results = await searchConditions("")
      setSuggestions(results.slice(0, 5))
    } catch (error) {
      console.error("Error fetching suggestions on focus:", error)
    }
    setLoading(false)
  }

  const handleFilterChange = async (key: keyof SearchFilters, value: any) => {
    // First update the filters
    setFilters((prev) => ({ ...prev, [key]: value }))

    // Add a small delay to ensure state is updated before searching
    setTimeout(() => {
      handleSearch()
    }, 0)
  }

  const handleSuggestionClick = async (suggestion: string) => {
    // First update both condition and filters
    setCondition(suggestion)
    setFilters((prev) => ({
      ...prev,
      queryCond: suggestion,
    }))
    setSuggestions([])

    // Then trigger the search
    handleSearch()
  }

  return (
    <div className="w-full font-mono">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 transform text-black" />
            <input
              type="text"
              placeholder="Search by condition, disease, or other health issue"
              value={condition}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              className={inputStyles}
            />

            {suggestions.length > 0 && (
              <div className="absolute z-10 mt-2 w-full rounded-xl border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={suggestionButtonStyles}
                    type="button"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSearching}
            className={`group flex items-center gap-2 rounded-xl border-4 border-black ${
              isSearching
                ? "cursor-not-allowed bg-gray-200"
                : "bg-gradient-to-r from-green-400 to-emerald-400 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
            } px-6 py-4 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all`}
          >
            {isSearching ? "Searching..." : "Find Trials"}
            <ArrowRight className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 rounded-xl border-4 border-black bg-white px-4 py-2 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
        >
          <ChevronDown
            className={`transform transition-transform ${showFilters ? "rotate-180" : ""}`}
          />
          {showFilters ? "Hide" : "Show"} Advanced Search Options
        </button>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-6 rounded-xl border-4 border-black bg-gradient-to-r from-pink-400 to-purple-400 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              {/* Study Status - Only showing this filter */}
              <div className="rounded-xl border-4 border-black bg-white p-4">
                <label className="mb-2 block font-bold text-black">
                  Study Status
                </label>
                <div className="grid gap-2">
                  {[
                    "All studies",
                    "Recruiting",
                    "Not yet recruiting",
                    "Active, not recruiting",
                    "Completed",
                    "Enrolling by invitation",
                  ].map((status) => (
                    <label key={status} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="studyStatus"
                        value={status}
                        checked={filters.status === status}
                        onChange={(e) =>
                          handleFilterChange("status", e.target.value)
                        }
                        className="h-5 w-5"
                      />
                      <span className="font-bold">{status}</span>
                    </label>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {searchError && (
          <div className="mt-2 rounded-lg border-2 border-red-500 bg-red-100 p-2 text-red-700">
            {searchError}
          </div>
        )}
      </form>
    </div>
  )
}
