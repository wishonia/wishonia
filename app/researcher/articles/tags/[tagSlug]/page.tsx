'use client'

import { useParams } from 'next/navigation'
import ArticleSearchAndGrid from "@/components/article/ArticleSearchAndGrid";

type Params = {
    tagSlug: string
}

export default function TagArticles() {
    const params = useParams<Params>()
    const tagSlug = params?.tagSlug ?? ''

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Articles in {tagSlug}</h1>
            <ArticleSearchAndGrid tagSlug={tagSlug} />
        </div>
    )
}