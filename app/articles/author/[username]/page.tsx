import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ArticleSearchAndGrid from "@/components/article/ArticleSearchAndGrid"

export async function generateMetadata({ params }: { params: { username: string } }) {
  const author = await prisma.user.findUnique({
    where: { username: params.username }
  })

  if (!author) {
    return {
      title: 'Author Not Found'
    }
  }

  return {
    title: `Articles by ${author.name}`,
    description: `Browse all articles written by ${author.name}`
  }
}

export default async function AuthorPage({ params }: { params: { username: string } }) {
  const author = await prisma.user.findUnique({
    where: { username: params.username },
    include: {
      _count: {
        select: { authoredArticles: true }
      }
    }
  })

  if (!author) {
    notFound()
  }

  return (
    <div className="container py-8">
      <div className="flex items-center gap-4 mb-8">
        <Avatar className="h-20 w-20">
          <AvatarImage src={author.image || ''} alt={author.name || ''} />
          <AvatarFallback>{author.name?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{author.name}</h1>
          <p className="text-muted-foreground">@{author.username}</p>
          {author.bio && <p className="mt-2">{author.bio}</p>}
          <p className="text-sm text-muted-foreground mt-1">
            {author._count.authoredArticles} articles published
          </p>
        </div>
      </div>
      <ArticleSearchAndGrid authorUsername={params.username} />
    </div>
  )
} 