import { prisma } from "@/lib/prisma";
import TagsList from "@/components/tags/TagsList";

export const metadata = {
  title: "Article Tags",
  description: "Browse all article tags",
}

async function getTags() {
  return prisma.articleTag.findMany({
    include: {
      _count: {
        select: {articles: true},
      },
    },
    orderBy: {
      name: "asc",
    },
  });
}
export default async function TagsPage() {
    const tags = await getTags();
  return (
    <div className="container py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold">Browse Tags</h1>
        <TagsList tags={tags} />
      </div>
    </div>
  )
}