'use client'

import { useState, useEffect } from 'react'
import { X } from "lucide-react"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { searchTreatmentsAndConditions } from '../../dfdaActions'

type SearchResult = {
  id: number
  name: string
  type: 'treatment' | 'condition'
}

export function SearchBox() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleSearch = async () => {
      if (query.length > 2) {
        setIsLoading(true)
        const searchResults = await searchTreatmentsAndConditions(query)
        setResults(searchResults as SearchResult[])
        setIsLoading(false)
      } else {
        setResults([])
      }
    }

    const debounce = setTimeout(() => {
      handleSearch()
    }, 300)

    return () => clearTimeout(debounce)
  }, [query])

  const handleClear = () => {
    setQuery('')
    setResults([])
  }

  const handleClose = () => {
    router.back()
  }

  return (
    <div className="w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search treatments or conditions..."
          className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2"
            aria-label="Clear search"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        )}
      </div>

      {isLoading && (
        <div className="mt-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-4 space-y-2">
          {results.map((result) => (
            <Link
              key={`${result.type}-${result.id}`}
              href={result.type === 'treatment' ? `/dfda/treatments/${result.name}` : `/dfda/conditions/${result.name}`}
              className="block p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <span>{result.name}</span>
                <span className="text-sm text-gray-500 capitalize">{result.type}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
} 