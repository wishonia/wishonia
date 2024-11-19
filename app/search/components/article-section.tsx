'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'

interface ArticleSource {
  text: string
  url: string
  title: string
}

interface ArticleImage {
  url: string
  caption: string
  placement: string
}

interface ArticleResult {
  content: string
  sources: ArticleSource[]
  images: ArticleImage[]
}

export function ArticleSection({ 
  result,
  style 
}: { 
  result?: ArticleResult
  style: 'formal' | 'casual' | 'technical'
}) {
  const [article, setArticle] = useState<ArticleResult | null>(null)

  useEffect(() => {
    if (result) {
      setArticle(result)
    }
  }, [result])

  if (!article) {
    return <div>Generating article...</div>
  }

  return (
    <Card className="p-6">
      <div className="prose dark:prose-invert max-w-none">
        {article.content.split('\n').map((paragraph, index) => (
          <div key={index} className="mb-4">
            {paragraph}
            {article.images.find(img => img.placement === `paragraph-${index}`) && (
              <figure className="my-4">
                <Image
                  src={article.images[index].url}
                  alt={article.images[index].caption}
                  width={600}
                  height={400}
                  className="rounded-lg"
                />
                {article.images[index].caption && (
                  <figcaption className="text-sm text-gray-500 mt-2 text-center">
                    {article.images[index].caption}
                  </figcaption>
                )}
              </figure>
            )}
          </div>
        ))}
        
        <div className="mt-8 border-t pt-4">
          <h3 className="text-lg font-semibold">Sources</h3>
          <ul className="list-decimal pl-5">
            {article.sources.map((source, index) => (
              <li key={index}>
                <a 
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {source.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  )
} 