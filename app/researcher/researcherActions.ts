"use server";

import { revalidatePath } from "next/cache";
import { PrismaClient } from "@prisma/client";
import {
  ArticleWithRelations,
  deleteArticleByPromptedTopic,
  findArticleByTopic,
  getArticleBySlug,
  writeArticle
} from "@/lib/agents/researcher/researcher";
import OpenAI from "openai";
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})
const prisma = new PrismaClient()

export async function searchArticles(query: string, categorySlug?: string) {
  try {
    const whereClause: any = {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    };

    if (categorySlug) {
      whereClause.category = { slug: categorySlug };
    }

    return await prisma.article.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        featuredImage: true,
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
        tags: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        publishedAt: "desc",
      },
      take: 20, // Limit the number of results
    })
  } catch (error) {
    console.error("Failed to fetch articles:", error)
    throw new Error("Failed to fetch articles")
  }
}

export async function getArticleBySlugAction(slug: string): Promise<ArticleWithRelations | null> {
  return getArticleBySlug(slug)
}

export async function findOrCreateArticleByTopic(
  topic: string,
  userId: string
): Promise<ArticleWithRelations> {
  let article: ArticleWithRelations | null

  article = await findArticleByTopic(topic)
  if (!article) {
    article = await writeArticle(topic, userId)
  }

  revalidatePath("/")
  return article
}

export async function generateImage(topic: string, articleId: string) {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Create an image representing the topic: ${topic}
      Use a cool retro futuristic 16-bit 90s style.
      `,
      n: 1,
      size: "1792x1024",
    })

    const imageUrl = response.data[0].url
    if (imageUrl && articleId) {
      await prisma.article.update({
        where: {
          id: articleId,
        },
        data: {
          featuredImage: imageUrl,
        },
      })
    }

    revalidatePath("/")
    return imageUrl
  } catch (error) {
    console.error("Error generating image:", error)
    throw new Error("Failed to generate image")
  }
}

export async function deleteArticle(topic: string, userId: string) {
  return await deleteArticleByPromptedTopic(topic, userId);
}