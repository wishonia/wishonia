'use client'

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import SearchFilter from "@/components/ui/SearchFilter"
import { useState } from "react"

type Author = {
  id: string
  name: string | null
  username: string
  image: string | null
  bio: string | null
  _count: {
    authoredArticles: number
  }
}

export default function AuthorsList({ authors: initialAuthors }: { authors: Author[] }) {
  const [filteredAuthors, setFilteredAuthors] = useState(initialAuthors)

  const handleSearch = (query: string) => {
    const filtered = initialAuthors.filter(author => 
      author.name?.toLowerCase().includes(query.toLowerCase()) ||
      author.username.toLowerCase().includes(query.toLowerCase()) ||
      (author.bio?.toLowerCase() || '').includes(query.toLowerCase())
    )
    setFilteredAuthors(filtered)
  }

  return (
    <>
      <SearchFilter 
        placeholder="Search authors..." 
        onSearch={handleSearch}
      />

      <div className="grid grid-cols-1 gap-4 mt-6">
        {filteredAuthors.map((author) => (
          <Link
            key={author.id}
            href={`/articles/author/${author.username}`}
            className="group"
          >
            <div className="flex items-center justify-between p-4 rounded-lg border group-hover:border-primary transition-colors">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={author.image || ''} alt={author.name || ''} />
                  <AvatarFallback>{author.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium group-hover:text-primary transition-colors">
                    {author.name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    @{author.username}
                  </span>
                  {author.bio && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {author.bio}
                    </p>
                  )}
                </div>
                <Badge variant="secondary" className="ml-4">
                  {author._count.authoredArticles} articles
                </Badge>
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

      {filteredAuthors.length === 0 && (
        <p className="text-center text-muted-foreground mt-8">
          No authors found matching your search.
        </p>
      )}
    </>
  )
} 