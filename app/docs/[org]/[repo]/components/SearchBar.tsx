'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { X, Search } from 'lucide-react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Command } from 'cmdk'
import { MenuItem } from '../lib/parseSummary'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

interface SearchResult {
  title: string
  path: string
  excerpt: string
  emoji?: string
}

interface SearchBarProps {
  menu: MenuItem[]
  onClose?: () => void
  mobile?: boolean
}

function SearchResults({ 
  results, 
  onSelect,
  mobile
}: { 
  results: SearchResult[]
  onSelect: (result: SearchResult) => void
  mobile?: boolean
}) {
  return (
    <div className="max-h-[300px] overflow-y-auto p-2">
      {results.map((result) => (
        <button
          key={result.path}
          className={cn(
            "w-full rounded-md px-4 py-2 text-sm text-left",
            "hover:bg-accent hover:text-accent-foreground",
            "focus:outline-none focus:bg-accent focus:text-accent-foreground"
          )}
          onClick={() => onSelect(result)}
        >
          <div className="flex items-center">
            {result.emoji && <span className="mr-2">{result.emoji}</span>}
            <span className="font-medium">{result.title}</span>
          </div>
        </button>
      ))}
    </div>
  )
}

function SearchInput({ 
  query, 
  setQuery, 
  onSearch 
}: { 
  query: string
  setQuery: (q: string) => void
  onSearch: (q: string) => void
}) {
  return (
    <div className="flex items-center border-b px-3">
      <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
      <input
        className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="Type to search..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          onSearch(e.target.value)
        }}
      />
      {query && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => {
            setQuery('')
            onSearch('')
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

export default function SearchBar({ menu, onClose, mobile }: SearchBarProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!mobile) {
      const down = (e: KeyboardEvent) => {
        if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
          e.preventDefault()
          setOpen(true)
        }
      }
      document.addEventListener('keydown', down)
      return () => document.removeEventListener('keydown', down)
    }
  }, [mobile])

  const flattenMenuItems = (items: MenuItem[], results: SearchResult[] = []): SearchResult[] => {
    items.forEach(item => {
      results.push({
        title: item.title,
        path: item.path,
        excerpt: '',
        emoji: item.emoji
      })
      if (item.children) {
        flattenMenuItems(item.children, results)
      }
    })
    return results
  }

  const searchItems = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    const allItems = flattenMenuItems(menu)
    const searchResults = allItems.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    setResults(searchResults)
  }

  const handleSelect = (result: SearchResult) => {
    const params = new URLSearchParams(searchParams)
    params.set('file', `${result.path}.md`)
    router.push(`${pathname}?${params.toString()}`)
    setOpen(false)
    onClose?.()
    setQuery('')
    setResults([])
  }

  const searchContent = (
    <Command className="rounded-lg border shadow-md">
      <SearchInput query={query} setQuery={setQuery} onSearch={searchItems} />
      {results.length > 0 && (
        <SearchResults results={results} onSelect={handleSelect} mobile={mobile} />
      )}
      {query && results.length === 0 && (
        <div className="p-4 text-sm text-muted-foreground">
          No results found.
        </div>
      )}
    </Command>
  )

  if (mobile) {
    return searchContent
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="relative w-full justify-start text-sm text-muted-foreground"
          onClick={() => setOpen(true)}
        >
          <Search className="mr-2 h-4 w-4" />
          <span>Search documentation...</span>
          <kbd className="pointer-events-none absolute right-2 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0">
        {searchContent}
      </DialogContent>
    </Dialog>
  )
} 