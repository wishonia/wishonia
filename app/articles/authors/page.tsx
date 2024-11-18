import { prisma } from "@/lib/prisma"
import AuthorsList from "@/components/authors/AuthorsList"

export const metadata = {
  title: 'Article Authors',
  description: 'Browse all article authors'
}

async function getAuthors() {
  const authors = await prisma.user.findMany({
    where: {
      authoredArticles: {
        some: {}
      }
    },
    include: {
      _count: {
        select: { authoredArticles: true }
      }
    },
    orderBy: {
      name: 'asc'
    }
  })
  return authors
}

export default async function AuthorsPage() {
  const authors = await getAuthors()

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Browse Authors</h1>
        <AuthorsList authors={authors} />
      </div>
    </div>
  )
} 