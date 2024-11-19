'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { GlobalVariable } from '@/types/models/GlobalVariable'
import { searchDfdaVariables } from '@/lib/clinicaltables'

interface VariableSearchAutocompleteProps {
  onVariableSelect: (variable: GlobalVariable) => void
  searchParams?: Record<string, string>
  placeholder: string
}

// Add cache interface
interface SearchCache {
  timestamp: number
  results: GlobalVariable[]
}

// Add cache duration constant (e.g., 1 hour)
const CACHE_DURATION = 60 * 60 * 1000

function getCachedResults(key: string): GlobalVariable[] | null {
  try {
    const cached = localStorage.getItem(key)
    if (!cached) return null

    const { timestamp, results } = JSON.parse(cached) as SearchCache
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(key)
      return null
    }

    return results
  } catch (error) {
    console.error('Error reading from cache:', error)
    return null
  }
}

function setCachedResults(key: string, results: GlobalVariable[]) {
  try {
    const cacheData: SearchCache = {
      timestamp: Date.now(),
      results
    }
    localStorage.setItem(key, JSON.stringify(cacheData))
  } catch (error) {
    console.error('Error writing to cache:', error)
  }
}

export default function VariableSearchAutocomplete({ 
  onVariableSelect, 
  searchParams = {},
  placeholder 
}: VariableSearchAutocompleteProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [variables, setVariables] = useState<GlobalVariable[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const componentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const search = async () => {
      console.log('Searching for:', searchTerm ? `"${searchTerm}"` : '(empty string)')
      setIsLoading(true)
      try {
        // Create a cache key based on search term and params
        const cacheKey = `dfda-variable-search:${searchTerm}:${JSON.stringify(searchParams)}`
        
        // Check cache first
        const cachedResults = getCachedResults(cacheKey)
        if (cachedResults) {
          console.log(`Using cached results for ${cacheKey}`)
          setVariables(cachedResults)
          setIsLoading(false)
          return
        }

        // If not in cache, perform the search
        const results = await searchDfdaVariables(searchTerm, searchParams)
        console.log(`Search results for ${cacheKey}:`, results.length, 'items found')
        
        // Cache the results
        setCachedResults(cacheKey, results)
        setVariables(results)
      } catch (error) {
        console.error('Error searching:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const debounce = setTimeout(search, 300)
    return () => clearTimeout(debounce)
  }, [searchTerm, searchParams])

  return (
    <div ref={componentRef} className="relative flex-grow">
      <Input
        type="search"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value)
          setShowDropdown(true)
        }}
        onFocus={() => {
          setShowDropdown(true)
          if (!searchTerm) {
            setSearchTerm('')
          }
        }}
        placeholder={placeholder}
        className="rounded-xl border-4 border-black bg-white p-4 text-xl placeholder:text-gray-500 focus:ring-4 focus:ring-blue-500"
      />
      
      {showDropdown && (isLoading || variables.length > 0) && (
        <div className="absolute z-10 mt-2 w-full rounded-xl border-4 border-black bg-white shadow-lg">
          {isLoading && (
            <div className="flex items-center gap-2 px-4 py-2 text-gray-500">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500"></div>
              <span>Searching...</span>
            </div>
          )}
          
          {variables.map((variable, index) => (
            <button
              key={index}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
              onClick={() => {
                onVariableSelect(variable)
                setSearchTerm('')
                setShowDropdown(false)
              }}
            >
              <div className="flex items-center gap-2">
                {variable.pngUrl && (
                  <img src={variable.pngUrl} alt="" className="h-6 w-6" />
                )}
                {variable.name}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
} 