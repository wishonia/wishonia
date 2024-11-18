'use client'

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import SearchFilter from "@/components/ui/SearchFilter"
import { useState } from "react"

type Tag = {
  id: string
  name: string
  slug: string
  _count: {
    articles: number
  }
}

export default function TagsList({ tags: initialTags }: { tags: Tag[] }) {
  const [filteredTags, setFilteredTags] = useState(initialTags)

  const handleSearch = (query: string) => {
    const filtered = initialTags.filter(tag => 
      tag.name.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredTags(filtered)
  }

  return (
    <>
      <SearchFilter 
        placeholder="Search tags..." 
        onSearch={handleSearch}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {filteredTags.map((tag) => (
          <Link 
            key={tag.id}
            href={`/articles/tag/${tag.slug}`}
            className="group"
          >
            <div className="flex items-center justify-between p-4 rounded-lg border group-hover:border-primary transition-colors">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="w-12 justify-center">
                  {tag._count.articles}
                </Badge>
                <span className="font-medium group-hover:text-primary transition-colors">
                  {tag.name}
                </span>
              </div>
              <svg 
                className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors"
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" 
                  clipRule="evenodd" 
                />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {filteredTags.length === 0 && (
        <p className="text-center text-muted-foreground mt-8">
          No tags found matching your search.
        </p>
      )}
    </>
  )
} 