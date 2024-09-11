'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import ArticleGrid from '@/components/ArticleGrid'
import ArticleSearchBox from '@/components/ArticleSearchBox'
import {searchArticles} from "@/app/researcher/researcherActions";

type Article = {
    id: string;
    title: string;
    slug: string;
    description: string;
    featuredImage: string | null;
    category: { slug: string; name: string };
    tags: { slug: string; name: string }[];
};

type Params = {
    categorySlug: string
}

export default function CategoryArticles() {
    const params = useParams<Params>()
    const categorySlug = params?.categorySlug ?? ''
    const [articles, setArticles] = useState<Article[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        const fetchArticles = async () => {
            setIsLoading(true)
            const results = await searchArticles(searchQuery, categorySlug)
            setArticles(results)
            setIsLoading(false)
        }
        fetchArticles()
    }, [categorySlug, searchQuery])

    const handleSearch = (query: string) => {
        setSearchQuery(query)
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Articles in {categorySlug}</h1>
            <ArticleSearchBox
                searchQuery={searchQuery} 
                setSearchQuery={handleSearch}
                isLoading={isLoading}
            />
            <ArticleGrid articles={articles} />
            {articles.length === 0 && !isLoading && (
                <p className="text-center text-muted-foreground mt-6">No articles found in this category.</p>
            )}
        </div>
    )
}