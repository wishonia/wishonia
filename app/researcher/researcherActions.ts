"use server";

import { revalidatePath } from "next/cache";
import { PrismaClient, ArticleStatus } from "@prisma/client";
import {
  ArticleWithRelations,
  deleteArticleByPromptedTopic,
  findArticleByTopic,
  getArticleBySlug,
  writeArticle
} from "@/lib/agents/researcher/researcher";
import OpenAI from "openai";
import {uploadImageToVercel} from "@/lib/imageUploader";
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})
const prisma = new PrismaClient()

type SortField = 'createdAt' | 'updatedAt' | 'publishedAt' | 'title'
type SortOrder = 'asc' | 'desc'

export async function searchArticles(
  searchQuery: string,
  categorySlug?: string,
  tagSlug?: string,
  authorUsername?: string,
  status: ArticleStatus = ArticleStatus.PUBLISH,
  sortField: SortField = 'publishedAt',
  sortOrder: SortOrder = 'desc',
  page: number = 1,
  pageSize: number = 12
) {
  try {
    const skip = (page - 1) * pageSize;

    const [articles, totalCount] = await Promise.all([
      prisma.article.findMany({
        where: {
          AND: [
            { status: status },
            { deletedAt: null },
            searchQuery ? {
              OR: [
                { title: { contains: searchQuery, mode: 'insensitive' } },
                { description: { contains: searchQuery, mode: 'insensitive' } },
                { content: { contains: searchQuery, mode: 'insensitive' } },
              ],
            } : {},
            categorySlug ? {
              category: {
                slug: categorySlug
              }
            } : {},
            tagSlug ? {
              tags: {
                some: {
                  slug: tagSlug
                }
              }
            } : {},
            authorUsername ? {
              user: {
                username: authorUsername
              }
            } : {},
          ],
        },
        include: {
          user: {
            select: {
              name: true,
              username: true,
            },
          },
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
          [sortField]: sortOrder,
        },
        skip,
        take: pageSize,
      }),
      prisma.article.count({
        where: {
          AND: [
            { status: status },
            { deletedAt: null },
            searchQuery ? {
              OR: [
                { title: { contains: searchQuery, mode: 'insensitive' } },
                { description: { contains: searchQuery, mode: 'insensitive' } },
                { content: { contains: searchQuery, mode: 'insensitive' } },
              ],
            } : {},
            categorySlug ? {
              category: {
                slug: categorySlug
              }
            } : {},
            tagSlug ? {
              tags: {
                some: {
                  slug: tagSlug
                }
              }
            } : {},
            authorUsername ? {
              user: {
                username: authorUsername
              }
            } : {},
          ],
        },
      })
    ]);

    return {
      articles,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize)
    };
  } catch (error) {
    console.error('Error searching articles:', error)
    throw error
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
    if (!imageUrl) {
      throw new Error("Failed to generate image")
    }
    const imgPath = 'articles/' + articleId + '/featured-image'
    // get the buffer from the imageUrl
    const buffer = await fetch(imageUrl).then(res => res.arrayBuffer())
    const vercelUrl = await uploadImageToVercel(Buffer.from(buffer), imgPath)
    if (imageUrl && articleId) {
      await prisma.article.update({
        where: {
          id: articleId,
        },
        data: {
          featuredImage: vercelUrl,
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