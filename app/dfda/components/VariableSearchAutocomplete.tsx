'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { GlobalVariable } from '@/types/models/GlobalVariable'
import { searchDfdaVariables } from '@/lib/clinicaltables'

interface VariableSearchAutocompleteProps {
  onVariableSelect: (variable: GlobalVariable) => void
  searchParams?: Record<string, string>
  placeholder: string
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

  useEffect(() => {
    const search = async () => {
      console.log('Searching for:', searchTerm ? `"${searchTerm}"` : '(empty string)')
      setIsLoading(true)
      try {
        const results = await searchDfdaVariables(searchTerm, searchParams)
        console.log('Search results:', results.length, 'items found')
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
    <div className="relative flex-grow">
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