'use client'

import { Input } from "@/components/ui/input"
import { useState } from "react"

type SearchFilterProps = {
  placeholder: string
  onSearch: (query: string) => void
}

export default function SearchFilter({ placeholder, onSearch }: SearchFilterProps) {
  const [query, setQuery] = useState('')

  const handleSearch = (value: string) => {
    setQuery(value)
    onSearch(value)
  }

  return (
    <div className="w-full max-w-sm mb-8">
      <Input
        type="search"
        placeholder={placeholder}
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full"
      />
    </div>
  )
} 