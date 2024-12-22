"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Command } from "cmdk"
import debounce from "lodash/debounce"
import { Loader2, Search, X } from "lucide-react"

import { useDetailedRateLimit } from "@/lib/hooks/useDetailedRateLimit"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

import { searchRepoContent } from "../actions"
import { MenuItem } from "../lib/parseSummary"

interface SearchResult {
  title: string
  path: string
  excerpt: string
  score?: number
  emoji?: string
}

interface SearchBarProps {
  menu: MenuItem[]
  onClose?: () => void
  mobile?: boolean
}

interface SearchCache {
  query: string
  results: SearchResult[]
  timestamp: number
}

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
const DEBOUNCE_DELAY = 300 // 300ms

export default function SearchBar({ menu, onClose, mobile }: SearchBarProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const searchCache = useRef<SearchCache[]>([])
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const { data: rateLimit, error: rateLimitError } = useDetailedRateLimit()

  const getAllFiles = useCallback(() => {
    const allItems = flattenMenuItems(menu)
    return allItems.sort((a, b) => a.title.localeCompare(b.title))
  }, [menu])

  useEffect(() => {
    if (open) {
      setResults(getAllFiles())
    }
  }, [open, getAllFiles])

  useEffect(() => {
    if (!mobile) {
      const down = (e: KeyboardEvent) => {
        if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault()
          setOpen(true)
        }
      }
      document.addEventListener("keydown", down)
      return () => document.removeEventListener("keydown", down)
    }
  }, [mobile])

  const flattenMenuItems = (
    items: MenuItem[],
    results: SearchResult[] = []
  ): SearchResult[] => {
    items.forEach((item) => {
      if (!item.children) {
        results.push({
          title: item.title,
          path: item.path,
          excerpt: "",
          emoji: item.emoji,
        })
      }
      if (item.children) {
        flattenMenuItems(item.children, results)
      }
    })
    return results
  }

  const checkSearchRateLimit = useCallback(() => {
    if (!rateLimit) return true

    const searchLimit = rateLimit.resources.search
    if (searchLimit.remaining < 5) {
      const resetTime = new Date(searchLimit.reset)
      throw new Error(
        `Search rate limit nearly exceeded. Resets at ${resetTime.toLocaleTimeString()}`
      )
    }
    return true
  }, [rateLimit])

  const getCachedResults = (searchQuery: string): SearchResult[] | null => {
    const cached = searchCache.current.find(
      (cache) =>
        cache.query === searchQuery &&
        Date.now() - cache.timestamp < CACHE_DURATION
    )
    return cached?.results || null
  }

  const cacheResults = (searchQuery: string, searchResults: SearchResult[]) => {
    searchCache.current = [
      { query: searchQuery, results: searchResults, timestamp: Date.now() },
      ...searchCache.current.slice(0, 9), // Keep last 10 searches
    ]
  }

  const searchItems = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults(getAllFiles())
        setIsLoading(false)
        return
      }

      try {
        setError(null)

        // Check cache first
        const cachedResults = getCachedResults(searchQuery)
        if (cachedResults) {
          setResults(cachedResults)
          setIsLoading(false)
          return
        }

        // Check rate limit
        checkSearchRateLimit()

        const pathParts = pathname.split("/")
        const org = pathParts[2]
        const repo = pathParts[3]

        if (!org || !repo) return

        const searchResults = await searchRepoContent(org, repo, searchQuery)
        cacheResults(searchQuery, searchResults)
        setResults(searchResults)
      } catch (error) {
        console.error("Search error:", error)
        setError(error instanceof Error ? error.message : "Search failed")

        // Fallback to local search
        const allItems = flattenMenuItems(menu)
        const searchResults = allItems.filter((item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
        setResults(searchResults)
      } finally {
        setIsLoading(false)
      }
    }, DEBOUNCE_DELAY),
    [pathname, menu, checkSearchRateLimit, getAllFiles]
  )

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      searchItems.cancel()
    }
  }, [searchItems])

  const handleSelect = (result: SearchResult) => {
    const params = new URLSearchParams(searchParams)
    const filePath = result.path.endsWith(".md")
      ? result.path
      : `${result.path}.md`
    params.set("file", filePath)
    router.push(`${pathname}?${params.toString()}`)
    setOpen(false)
    onClose?.()
    setQuery("")
    setResults([])
  }

  const searchContent = (
    <Command className="rounded-lg border shadow-md">
      <div className="flex items-center border-b px-3">
        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <input
          className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Search documentation..."
          value={query}
          onChange={(e) => {
            const newQuery = e.target.value
            setQuery(newQuery)
            if (newQuery.trim()) {
              setIsLoading(true)
            }
            searchItems(newQuery)
          }}
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => {
              setQuery("")
              searchItems("")
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        {isLoading && (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>
      <div className="max-h-[300px] overflow-y-auto p-2">
        {error && <div className="p-4 text-sm text-destructive">{error}</div>}
        {results.map((result) => (
          <button
            key={result.path}
            className={cn(
              "w-full rounded-md px-4 py-2 text-left text-sm",
              "hover:bg-accent hover:text-accent-foreground",
              "focus:bg-accent focus:text-accent-foreground focus:outline-none"
            )}
            onClick={() => handleSelect(result)}
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {result.emoji && <span className="mr-2">{result.emoji}</span>}
                  <span className="font-medium">{result.title}</span>
                </div>
                {result.score && (
                  <span className="text-xs text-muted-foreground">
                    Score: {result.score.toFixed(2)}
                  </span>
                )}
              </div>
              {result.excerpt && (
                <p className="line-clamp-2 text-xs text-muted-foreground">
                  {result.excerpt}
                </p>
              )}
            </div>
          </button>
        ))}
        {query && results.length === 0 && !isLoading && (
          <div className="p-4 text-sm text-muted-foreground">
            No results found.
          </div>
        )}
      </div>
    </Command>
  )

  if (mobile) {
    return searchContent
  }

  return (
    <>
      <Input
        type="text"
        placeholder="Search docs..."
        onClick={() => setOpen(true)}
        readOnly
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogTitle className="sr-only">Search Documentation</DialogTitle>
          {searchContent}
        </DialogContent>
      </Dialog>
    </>
  )
}