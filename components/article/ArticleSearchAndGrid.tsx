'use client'

import { ArticleStatus } from '@prisma/client'
import { Search, SortAsc, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from 'react'

import { searchArticles } from '@/app/researcher/researcherActions'
import ArticleGrid from '@/components/ArticleGrid'
import { Badge } from "@/components/ui/badge"
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArticleWithRelations } from '@/lib/agents/researcher/researcher'
import { cn } from "@/lib/utils"

type SortOption = {
  label: string
  field: 'createdAt' | 'updatedAt' | 'publishedAt' | 'title'
  order: 'asc' | 'desc'
}

const sortOptions: SortOption[] = [
  { label: 'Newest First', field: 'createdAt', order: 'desc' },
  { label: 'Oldest First', field: 'publishedAt', order: 'asc' },
  { label: 'Recently Updated', field: 'updatedAt', order: 'desc' },
  { label: 'Title A-Z', field: 'title', order: 'asc' },
  { label: 'Title Z-A', field: 'title', order: 'desc' },
]

type ArticleSearchAndGridProps = {
  categorySlug?: string
  tagSlug?: string
  authorUsername?: string
  status?: ArticleStatus
}

export default function ArticleSearchAndGrid({ 
  categorySlug = '', 
  tagSlug = '',
  authorUsername = '',
  status = ArticleStatus.PUBLISH
}: ArticleSearchAndGridProps) {
  const [articles, setArticles] = useState<ArticleWithRelations[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSort, setSelectedSort] = useState<SortOption>(sortOptions[0])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const pageSize = 12

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true)
      try {
        const results = await searchArticles(
          searchQuery, 
          categorySlug, 
          tagSlug, 
          authorUsername,
          status,
          selectedSort.field,
          selectedSort.order,
          currentPage,
          pageSize
        )
        setArticles(results.articles as ArticleWithRelations[])
        setTotalPages(results.totalPages)
      } catch (error) {
        console.error('Error fetching articles:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchArticles()
  }, [categorySlug, tagSlug, authorUsername, searchQuery, status, selectedSort, currentPage])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1) // Reset to first page on new search
  }

  const handleSortChange = (value: string) => {
    const option = sortOptions.find(opt => `${opt.field}-${opt.order}` === value)
    if (option) {
      setSelectedSort(option)
      setCurrentPage(1) // Reset to first page on sort change
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 items-center p-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className={cn(
                "w-full pl-9 pr-4",
                isLoading && "pr-12"
              )}
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <SortAsc className="h-4 w-4 text-muted-foreground" />
            <Select
              value={`${selectedSort.field}-${selectedSort.order}`}
              onValueChange={handleSortChange}
            >
              <SelectTrigger className="w-[180px] bg-background">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem 
                    key={`${option.field}-${option.order}`} 
                    value={`${option.field}-${option.order}`}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {(categorySlug || tagSlug || authorUsername) && (
          <div className="px-4 py-2 border-t flex gap-2 flex-wrap">
            {categorySlug && (
              <Badge variant="secondary">
                Category: {categorySlug}
              </Badge>
            )}
            {tagSlug && (
              <Badge variant="secondary">
                Tag: {tagSlug}
              </Badge>
            )}
            {authorUsername && (
              <Badge variant="secondary">
                Author: {authorUsername}
              </Badge>
            )}
          </div>
        )}
      </div>

      <ArticleGrid articles={articles} />
      
      {articles.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No articles found.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <div className="flex items-center px-4 rounded-md border bg-background">
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
          </div>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}