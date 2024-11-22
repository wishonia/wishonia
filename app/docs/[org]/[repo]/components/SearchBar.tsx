"use client"

import { useCallback, useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Command } from "cmdk"
import { Search, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

import { MenuItem } from "../lib/parseSummary"

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

export default function SearchBar({ menu, onClose, mobile }: SearchBarProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

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

  const searchItems = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults(getAllFiles())
      return
    }

    const allItems = flattenMenuItems(menu)
    const searchResults = allItems.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    setResults(searchResults)
  }

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
            setQuery(e.target.value)
            searchItems(e.target.value)
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
      </div>
      <div className="max-h-[300px] overflow-y-auto p-2">
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
            <div className="flex items-center">
              {result.emoji && <span className="mr-2">{result.emoji}</span>}
              <span className="font-medium">{result.title}</span>
            </div>
          </button>
        ))}
        {query && results.length === 0 && (
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
      <DialogContent className="p-0">{searchContent}</DialogContent>
    </Dialog>
  )
}