'use client'

import Link from "next/link"
import { useState } from "react"

import SearchFilter from "@/components/ui/SearchFilter"
import { Badge } from "@/components/ui/badge"

type Category = {
  id: string
  name: string
  slug: string
  description?: string | null
  _count: {
    articles: number
  }
}

export default function CategoriesList({ categories: initialCategories }: { categories: Category[] }) {
  const [filteredCategories, setFilteredCategories] = useState(initialCategories)

  const handleSearch = (query: string) => {
    const filtered = initialCategories.filter(category => 
      category.name.toLowerCase().includes(query.toLowerCase()) ||
      (category.description?.toLowerCase() || '').includes(query.toLowerCase())
    )
    setFilteredCategories(filtered)
  }

  return (
    <>
      <SearchFilter 
        placeholder="Search categories..." 
        onSearch={handleSearch}
      />

      <div className="grid grid-cols-1 gap-4 mt-6">
        {filteredCategories.map((category) => (
          <Link
            key={category.id}
            href={`/articles/category/${category.slug}`}
            className="group"
          >
            <div className="flex items-center justify-between p-4 rounded-lg border group-hover:border-primary transition-colors">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="w-12 justify-center">
                  {category._count.articles}
                </Badge>
                <div>
                  <span className="font-medium group-hover:text-primary transition-colors">
                    {category.name}
                  </span>
                  {category.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {category.description}
                    </p>
                  )}
                </div>
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

      {filteredCategories.length === 0 && (
        <p className="text-center text-muted-foreground mt-8">
          No categories found matching your search.
        </p>
      )}
    </>
  )
} 