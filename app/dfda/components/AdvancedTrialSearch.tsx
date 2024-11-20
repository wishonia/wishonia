'use client'

import React, { useState } from 'react'
import { Search, ArrowRight, ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { searchConditions } from '@/lib/clinicaltables'
import { motion, AnimatePresence } from 'framer-motion'
interface SearchFilters {
  // Basic Search
  condition?: string
  otherTerms?: string
  intervention?: string
  
  // Location
  lat?: number
  lng?: number
  locStr?: string
  distance?: number
  zipCode?: string
  
  // Study Status
  status?: string[]
  
  // Eligibility
  sex?: 'all' | 'male' | 'female'
  ageGroup?: string[]
  ageRange?: {
    min?: number
    max?: number
  }
  acceptsHealthy?: boolean
  
  // Study Details
  phase?: string[]
  studyType?: string[]
  hasResults?: boolean
  
  // Documents
  documents?: string[]
  
  // Funder Type
  funderType?: string[]
  
  // Date Ranges
  dateRanges?: {
    [K in DateRangeKey]?: { from?: string; to?: string }
  }
  
  // Additional Search Fields
  title?: string
  outcome?: string
  sponsor?: string
  sponsorLead?: string
  studyIds?: string
  facilityName?: string
  hasViolations?: boolean
}

type DateRangeKey = 
  | 'studyStart'
  | 'primaryCompletion'
  | 'firstPosted'
  | 'resultsFirstPosted'
  | 'lastUpdatePosted'
  | 'studyCompletion'

const inputStyles = "w-full rounded-xl border-4 border-black bg-white px-12 py-4 text-lg font-bold text-black placeholder:text-gray-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline-none transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none"

const suggestionButtonStyles = "w-full border-b-4 border-black px-4 py-3 text-left font-bold text-black transition-colors hover:bg-yellow-200 last:border-none"

const numberInputStyles = "w-24 rounded-xl border-4 border-black bg-white px-3 py-2 text-black placeholder:text-gray-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"

const selectStyles = "rounded-xl border-4 border-black bg-white px-3 py-2 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"

const zipInputStyles = "w-32 rounded-xl border-4 border-black bg-white px-3 py-2 text-black placeholder:text-gray-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"

interface AdvancedTrialSearchProps {
  initialFilters?: Partial<SearchFilters>
}

export default function AdvancedTrialSearch({ initialFilters }: AdvancedTrialSearchProps) {
  const router = useRouter()
  const [condition, setCondition] = useState(initialFilters?.condition || '')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    sex: 'all',
    ageRange: {},
    ...initialFilters
  })

  const dateRangeFields: Array<{ key: DateRangeKey; label: string }> = [
    { key: 'studyStart', label: 'Study Start' },
    { key: 'primaryCompletion', label: 'Primary Completion' },
    { key: 'firstPosted', label: 'First Posted' },
    { key: 'resultsFirstPosted', label: 'Results First Posted' },
    { key: 'lastUpdatePosted', label: 'Last Update Posted' },
    { key: 'studyCompletion', label: 'Study Completion' }
  ]

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const queryParams = new URLSearchParams()
    
    // Basic Search
    if (condition) queryParams.set('cond', condition)
    if (filters.otherTerms) queryParams.set('term', filters.otherTerms)
    if (filters.intervention) queryParams.set('intr', filters.intervention)
    if (filters.outcome) queryParams.set('outc', filters.outcome)
    
    // Location
    if (filters.lat) queryParams.set('lat', filters.lat.toString())
    if (filters.lng) queryParams.set('lng', filters.lng.toString())
    if (filters.locStr) queryParams.set('locStr', filters.locStr)
    if (filters.distance) queryParams.set('distance', filters.distance.toString())
    
    // Age Range - format as "44y_44y"
    if (filters.ageRange?.min || filters.ageRange?.max) {
      queryParams.set('ageRange', `${filters.ageRange.min || ''}y_${filters.ageRange.max || ''}y`)
    }
    
    // Date Ranges - format as "date_date"
    if (filters.dateRanges) {
      Object.entries(filters.dateRanges).forEach(([key, range]) => {
        if (range?.from || range?.to) {
          const paramKey = (() => {
            switch(key) {
              case 'studyStart': return 'start';
              case 'primaryCompletion': return 'primComp';
              case 'firstPosted': return 'firstPost';
              case 'resultsFirstPosted': return 'resFirstPost';
              case 'lastUpdatePosted': return 'lastUpdPost';
              case 'studyCompletion': return 'studyComp';
              default: return key;
            }
          })()
          queryParams.set(paramKey, `${range.from || ''}_${range.to || ''}`)
        }
      })
    }
    
    // Additional Search Fields
    if (filters.title) queryParams.set('titles', filters.title)
    if (filters.sponsor) queryParams.set('spons', filters.sponsor)
    if (filters.sponsorLead) queryParams.set('lead', filters.sponsorLead)
    if (filters.studyIds) queryParams.set('id', filters.studyIds)
    
    // Build aggFilters string with specific format
    const aggFilters: string[] = []
    
    // Documents
    if (filters.documents?.length) {
      aggFilters.push(`docs:${filters.documents.map(d => d.toLowerCase()).join(',')}`)
    }
    
    // Funder Type
    if (filters.funderType?.length) {
      aggFilters.push(`funderType:${filters.funderType.map(f => f.toLowerCase()).join(',')}`)
    }
    
    // Healthy Volunteers
    if (filters.acceptsHealthy) {
      aggFilters.push('healthy:y')
    }
    
    // Phase
    if (filters.phase?.length) {
      aggFilters.push(`phase:${filters.phase.map(p => p.replace('Phase ', '')).join(',')}`)
    }
    
    // Results
    if (filters.hasResults !== undefined) {
      aggFilters.push(`results:${filters.hasResults ? 'with' : 'without'}`)
    }
    
    // Sex - exclude 'all'
    if (filters.sex && filters.sex !== 'all') {
      aggFilters.push(`sex:${filters.sex}`)
    }
    
    // Status - convert to abbreviated format
    if (filters.status?.length) {
      const statusMap: Record<string, string> = {
        'Recruiting': 'rec',
        'Not yet recruiting': 'not_yet_rec',
        'Active, not recruiting': 'act',
        'Completed': 'comp',
        'Enrolling by invitation': 'enr_by_inv'
      }
      const statusCodes = filters.status
        .map(s => statusMap[s] || s.toLowerCase())
        .join(' ')
      aggFilters.push(`status:${statusCodes}`)
    }
    
    // Study Type - convert to abbreviated format
    if (filters.studyType?.length) {
      const typeMap: Record<string, string> = {
        'Interventional': 'int',
        'Observational': 'obs',
        'Patient Registry': 'pat_reg',
        'Expanded Access': 'exp'
      }
      const typeCodes = filters.studyType
        .map(t => typeMap[t] || t.toLowerCase())
        .join(' ')
      aggFilters.push(`studyType:${typeCodes}`)
    }
    
    // Violations
    if (filters.hasViolations) {
      aggFilters.push('violation:y')
    }
    
    if (aggFilters.length) {
      queryParams.set('aggFilters', aggFilters.join(','))
    }
    
    router.push(`/dfda/trials/search?${queryParams.toString()}`)
    
    // Collapse advanced options after search
    setShowFilters(false)
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
      console.error('Error fetching suggestions:', error)
    }
    setLoading(false)
  }

  const handleInputFocus = async () => {
    // Fetch default suggestions when the input is focused
    setLoading(true)
    try {
      const results = await searchConditions('')
      setSuggestions(results.slice(0, 5))
    } catch (error) {
      console.error('Error fetching suggestions on focus:', error)
    }
    setLoading(false)
  }

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
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
                    onClick={() => {
                      setCondition(suggestion)
                      setSuggestions([])
                    }}
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
            className="group flex items-center gap-2 rounded-xl border-4 border-black bg-gradient-to-r from-green-400 to-emerald-400 px-6 py-4 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          >
            Find Trials
            <ArrowRight className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 rounded-xl border-4 border-black bg-white px-4 py-2 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
        >
          <ChevronDown className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          {showFilters ? 'Hide' : 'Show'} Advanced Search Options
        </button>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-6 rounded-xl border-4 border-black bg-gradient-to-r from-pink-400 to-purple-400 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              {/* Sex Selection */}
              <div className="rounded-xl border-4 border-black bg-white p-4">
                <label className="mb-2 block font-bold">Sex</label>
                <div className="flex flex-wrap gap-4">
                  {['all', 'male', 'female'].map((option) => (
                    <label key={option} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="sex"
                        value={option}
                        checked={filters.sex === option}
                        onChange={(e) => handleFilterChange('sex', e.target.value)}
                        className="h-5 w-5"
                      />
                      <span className="font-bold capitalize">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Age Range */}
              <div className="rounded-xl border-4 border-black bg-white p-4">
                <label className="mb-2 block font-bold text-black">Age Range</label>
                <div className="flex gap-4">
                  <input
                    type="number"
                    placeholder="Min Age"
                    min="0"
                    max="120"
                    value={filters.ageRange?.min || ''}
                    onChange={(e) => handleFilterChange('ageRange', { ...filters.ageRange, min: e.target.value })}
                    className={`${numberInputStyles} w-26 text-sm placeholder:text-sm`}
                  />
                  <span className="self-center font-bold text-black">to</span>
                  <input
                    type="number"
                    placeholder="Max Age"
                    min="0"
                    max="120"
                    value={filters.ageRange?.max || ''}
                    onChange={(e) => handleFilterChange('ageRange', { ...filters.ageRange, max: e.target.value })}
                    className={`${numberInputStyles} w-26 text-sm placeholder:text-sm`}
                  />
                </div>
              </div>

              {/* Study Phase */}
              <div className="rounded-xl border-4 border-black bg-white p-4">
                <label className="mb-2 block font-bold">Phase</label>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4'].map((phase) => (
                    <label key={phase} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filters.phase?.includes(phase)}
                        onChange={(e) => {
                          const newPhases = e.target.checked
                            ? [...(filters.phase || []), phase]
                            : filters.phase?.filter(p => p !== phase)
                          handleFilterChange('phase', newPhases)
                        }}
                        className="h-5 w-5"
                      />
                      <span className="font-bold">{phase}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Study Type */}
              <div className="rounded-xl border-4 border-black bg-white p-4">
                <label className="mb-2 block font-bold">Study Type</label>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  {['Interventional', 'Observational', 'Patient Registry'].map((type) => (
                    <label key={type} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filters.studyType?.includes(type)}
                        onChange={(e) => {
                          const newTypes = e.target.checked
                            ? [...(filters.studyType || []), type]
                            : filters.studyType?.filter(t => t !== type)
                          handleFilterChange('studyType', newTypes)
                        }}
                        className="h-5 w-5"
                      />
                      <span className="font-bold">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="rounded-xl border-4 border-black bg-white p-4">
                <label className="mb-2 block font-bold text-black">Location</label>
                <div className="flex flex-wrap gap-4">
                  <input
                    type="text"
                    placeholder="ZIP Code"
                    value={filters.zipCode || ''}
                    onChange={(e) => handleFilterChange('zipCode', e.target.value)}
                    className={zipInputStyles}
                  />
                  <select
                    value={filters.distance || ''}
                    onChange={(e) => handleFilterChange('distance', e.target.value)}
                    className={selectStyles}
                  >
                    <option value="">Select distance</option>
                    <option value="10">10 miles</option>
                    <option value="25">25 miles</option>
                    <option value="50">50 miles</option>
                    <option value="100">100 miles</option>
                  </select>
                </div>
              </div>

              {/* Study Status */}
              <div className="rounded-xl border-4 border-black bg-white p-4">
                <label className="mb-2 block font-bold text-black">Study Status</label>
                <div className="grid gap-2">
                  {[
                    'All studies',
                    'Recruiting',
                    'Not yet recruiting',
                    'Active, not recruiting',
                    'Completed',
                    'Enrolling by invitation'
                  ].map((status) => (
                    <label key={status} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filters.status?.includes(status)}
                        onChange={(e) => {
                          const newStatus = e.target.checked
                            ? [...(filters.status || []), status]
                            : filters.status?.filter(s => s !== status)
                          handleFilterChange('status', newStatus)
                        }}
                        className="h-5 w-5"
                      />
                      <span className="font-bold">{status}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date Ranges */}
              <div className="rounded-xl border-4 border-black bg-white p-4">
                <label className="mb-2 block font-bold text-black">Date Ranges</label>
                {dateRangeFields.map(({ key, label }) => (
                  <div key={key} className="mb-4">
                    <h4 className="mb-2 font-bold">{label}</h4>
                    <div className="flex gap-4">
                      <div>
                        <label className="text-sm">From</label>
                        <input
                          type="date"
                          value={filters.dateRanges?.[key]?.from || ''}
                          onChange={(e) => handleFilterChange('dateRanges', {
                            ...filters.dateRanges,
                            [key]: { ...filters.dateRanges?.[key], from: e.target.value }
                          })}
                          className={numberInputStyles}
                        />
                      </div>
                      <div>
                        <label className="text-sm">To</label>
                        <input
                          type="date"
                          value={filters.dateRanges?.[key]?.to || ''}
                          onChange={(e) => handleFilterChange('dateRanges', {
                            ...filters.dateRanges,
                            [key]: { ...filters.dateRanges?.[key], to: e.target.value }
                          })}
                          className={numberInputStyles}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  )
} 