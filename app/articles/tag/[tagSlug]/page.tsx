import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import ArticleSearchAndGrid from "@/components/article/ArticleSearchAndGrid"

export async function generateMetadata({ params }: { params: { tagSlug: string } }) {
  const tag = await prisma.articleTag.findUnique({
    where: { slug: params.tagSlug }
  })

  if (!tag) {
    return {
      title: 'Tag Not Found'
    }
  }

  return {
    title: `Articles tagged with ${tag.name}`,
    description: `Browse all articles tagged with ${tag.name}`
  }
}

export default async function TagPage({ params }: { params: { tagSlug: string } }) {
  const tag = await prisma.articleTag.findUnique({
    where: { slug: params.tagSlug }
  })

  if (!tag) {
    notFound()
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Articles tagged with &quot;{tag.name}&quot;</h1>
      <ArticleSearchAndGrid tagSlug={params.tagSlug} />
    </div>
  )
}