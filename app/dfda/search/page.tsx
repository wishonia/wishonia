'use client'

import { useState, useEffect } from 'react'
import { X } from "lucide-react"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { searchTreatmentsAndConditions } from '../dfdaActions'

type SearchResult = {
  id: number
  name: string
  type: 'treatment' | 'condition'
}

export default function TreatmentConditionSearchBox() {
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
      <div className="fixed top-0 right-0 p-4">
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600"
          aria-label="Close and go back"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      <div className="pt-16 px-4">
        <div className="relative mb-4">
          <input
            type="search"
            placeholder="Search conditions, treatments..."
            className="w-full pl-4 pr-10 py-2 text-lg border-b-2 border-gray-300 focus:border-primary focus:outline-none bg-transparent"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        {isLoading ? (
          <div className="text-center text-muted-foreground">Loading...</div>
        ) : (
          <ul className="space-y-4">
            {results.map((result) => (
              <li key={`${result.type}-${result.id}`}>
                <Link href={`/${result.type}s/${encodeURIComponent(result.name)}`} className="block">
                  <h3 className="text-lg font-semibold text-foreground">{result.name}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{result.type}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}