import { prisma } from "@/lib/prisma";
import CategoriesList from "@/components/categories/CategoriesList";

export const metadata = {
  title: "Article Categories",
  description: "Browse all article categories",
}

async function getCategories() {
  return prisma.articleCategory.findMany({
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

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="container py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold">Browse Categories</h1>
        <CategoriesList categories={categories} />
      </div>
    </div>
  )
}