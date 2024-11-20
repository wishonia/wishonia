import AuthorsList from "@/components/authors/AuthorsList"
import { getAuthors } from "../articleActions"

export const metadata = {
  title: 'Article Authors',
  description: 'Browse all article authors'
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