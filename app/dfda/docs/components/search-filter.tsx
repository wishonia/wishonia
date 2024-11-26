'use client'

import { useState } from "react"
import { Search } from "lucide-react"

interface SearchFilterProps {
  onSearch: (query: string) => void
}

export function SearchFilter({ onSearch }: SearchFilterProps) {
  const [query, setQuery] = useState("")

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    setQuery(newQuery)
    onSearch(newQuery)
  }

  return (
    <div className="relative mb-8">
      <div className="relative">
        <input
          type="text"
          placeholder="Search documentation..."
          value={query}
          onChange={handleSearch}
          className="w-full rounded-lg border-4 border-black bg-white px-12 py-4 text-lg font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
        />
        <Search className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2" />
      </div>
    </div>
  )
} 