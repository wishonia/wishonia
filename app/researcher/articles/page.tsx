'use client'

import { useState, useEffect } from 'react'
import { searchArticles } from '../researcherActions'
import ArticleGrid from '@/components/ArticleGrid'
import ArticleSearchBox from '@/components/ArticleSearchBox'

interface Article {
    id: string;
    title: string;
    slug: string;
    description: string;
    featuredImage: string | null;
    category: { slug: string; name: string };
    tags: { slug: string; name: string }[];
}

export default function ArticleList() {
    const [articles, setArticles] = useState<Article[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        const fetchArticles = async () => {
            setIsLoading(true)
            const results = await searchArticles(searchQuery)
            setArticles(results)
            setIsLoading(false)
        }
        fetchArticles()
    }, [searchQuery])

    const handleSearch = (query: string) => {
        setSearchQuery(query)
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Articles</h1>
            <ArticleSearchBox 
                searchQuery={searchQuery} 
                setSearchQuery={handleSearch}
                isLoading={isLoading}
            />
            <ArticleGrid articles={articles} />
            {articles.length === 0 && !isLoading && (
                <p className="text-center text-muted-foreground mt-6">No articles found.</p>
            )}
        </div>
    )
}