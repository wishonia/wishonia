import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArticleWithRelations } from '@/lib/agents/researcher/researcher'

type ArticleGridProps = {
    articles: ArticleWithRelations[]
}

export default function ArticleGrid({ articles }: ArticleGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
                <Card key={article.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    {article.featuredImage && (
                        <Link href={`/research/articles/${article.slug}`} className="block">
                            <div className="relative h-48 overflow-hidden">
                                <Image
                                    src={article.featuredImage}
                                    alt={article.title}
                                    layout="fill"
                                    objectFit="cover"
                                    className="transition-transform duration-300 hover:scale-105"
                                />
                            </div>
                        </Link>
                    )}
                    <CardHeader className="pb-2">
                        <Link href={`/researcher/articles/categories/${article.category.slug}`}>
                            <Badge variant="secondary" className="mb-2">{article.category.name}</Badge>
                        </Link>
                        <CardTitle className="text-xl">
                            <Link href={`/researcher/article/${article.slug}`}
                            className="hover:underline">
                                {article.title}
                            </Link>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground text-sm line-clamp-3">{article.description}</p>
                    </CardContent>
                    <CardFooter className="mt-auto pt-4 border-t">
                        <div className="flex flex-wrap gap-2">
                            {article.tags.map((tag) => (
                                <Link key={tag.name} href={`/research/tags/${tag.name}`}>
                                    <Badge variant="outline" className="text-xs">{tag.name}</Badge>
                                </Link>
                            ))}
                        </div>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}