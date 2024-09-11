import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type Article = {
    id: string
    title: string
    slug: string
    description: string
    featuredImage: string | null
    category: {
        name: string
        slug: string
    }
    tags: {
        name: string
        slug: string
    }[]
}

type ArticleGridProps = {
    articles: Article[]
}

export default function ArticleGrid({ articles }: ArticleGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
                <Card key={article.id} className="flex flex-col">
                    {article.featuredImage && (
                        <Link href={`/research/articles/${article.slug}`}>
                            <Image
                                src={article.featuredImage || '/placeholder.svg?height=200&width=300'}
                                alt={article.title}
                                width={300}
                                height={200}
                                className="w-full h-48 object-cover rounded-t-lg"
                            />
                        </Link>
                    )}
                    <CardHeader>
                        <CardTitle>
                            <Link href={`/researcher/articles/${article.slug}`}
                            className="hover:underline">
                                {article.title}
                            </Link>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Link href={`/researcher/categories/${article.category.slug}`}>
                            <Badge variant="secondary">{article.category.name}</Badge>
                        </Link>
                        <p className="text-muted-foreground">{article.description}</p>
                    </CardContent>
                    <CardFooter className="mt-auto">
                        <div className="flex flex-wrap gap-2">
                            {article.tags.map((tag) => (
                                <Link key={tag.name} href={`/research/tags/${tag.name}`}>
                                    <Badge variant="outline">{tag.name}</Badge>
                                </Link>
                            ))}
                        </div>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}