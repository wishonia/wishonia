'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from "@/components/ui/input"
import {Loader2, Search} from "lucide-react"
import Link from 'next/link'
import {searchTreatmentsAndConditions} from "@/app/dfda/dfdaActions";

type SearchResult = {
    id: number
    name: string
    type: 'treatment' | 'condition'
}

export default function TreatmentConditionSearchBox() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<SearchResult[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleSearch = async () => {
            if (query.length > 2) {
                setIsLoading(true)
                const searchResults = await searchTreatmentsAndConditions(query)
                setResults(searchResults.map(result => ({
                    ...result,
                    type: result.type as 'treatment' | 'condition'
                })))
                setIsLoading(false)
                setShowDropdown(true)
            } else {
                setResults([])
                setShowDropdown(false)
            }
        }

        const debounce = setTimeout(() => {
            handleSearch()
        }, 300)

        return () => clearTimeout(debounce)
    }, [query])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return (
        <div className="w-full max-w-md mx-auto relative" ref={dropdownRef}>
            <div className="relative">
                <Input
                    type="search"
                    placeholder="Search condition, treatments..."
                    className="w-full pl-4 pr-10 py-2 rounded-full border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                {isLoading ? (
                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 animate-spin" />
                ) : (
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                )}
            </div>
            {showDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-background rounded-md shadow-lg border border-input">
                    {results.length > 0 ? (
                        <ul className="max-h-60 overflow-auto">
                            {results.map((result) => (
                                <li key={`${result.type}-${result.id}`}>
                                    <Link
                                        href={`/dfda/${result.type}s/${encodeURIComponent(result.name)}`}
                                        className="block px-4 py-2 hover:bg-accent hover:text-accent-foreground text-sm"
                                    >
                                        {result.name} ({result.type})
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-2 text-center text-muted-foreground">No results found</div>
                    )}
                </div>
            )}
        </div>
    )
}