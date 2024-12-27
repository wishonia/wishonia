'use client'

import { useParams } from 'next/navigation'

import ArticleSearchAndGrid from "@/components/article/ArticleSearchAndGrid";

type Params = {
    categorySlug: string
}

export default function CategoryArticles() {
    const params = useParams<Params>()
    const categorySlug = params?.categorySlug ?? ''

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Articles in {categorySlug}</h1>
            <ArticleSearchAndGrid categorySlug={categorySlug} />
        </div>
    )
}