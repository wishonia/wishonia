import { LanguageModelV1 } from "@ai-sdk/provider";
import { Prisma, PrismaClient, ArticleStatus } from "@prisma/client";
import { generateObject } from "ai";
import { RegularSearchOptions, SearchResult } from "exa-js";
import { z } from "zod";
import { getSearchResults, getSearchResultsByUrl } from "@/lib/agents/researcher/getSearchResults";
import { generateSearchQueries } from "@/lib/agents/researcher/searchQueryGenerator";
import { DEFAULT_MODEL_NAME, getModel, ModelName } from "@/lib/utils/modelUtils";
import { slugify } from "@/lib/utils/slugify";
import { MODEL_PRICING } from "@/lib/constants/llmModelPricing";
const prisma = new PrismaClient()

const GeneratedReportSchema = z.object({
  title: z.string().describe("The title of the report"),
  description: z
    .string()
    .describe("A brief description or summary of the report"),
  content: z
    .string()
    .describe(
      "The main content of the report in markdown format. DO NOT include the title."
    ),
  sources: z
    .array(
      z.object({
        url: z.string(),
        title: z.string(),
        description: z.string(),
      })
    )
    .describe("An array of sources used in the report"),
  tags: z.array(z.string()).describe("Relevant tags for the report"),
  categoryName: z.string().describe("The main category of the report"),
})

type GeneratedReport = z.infer<typeof GeneratedReportSchema>

export type ReportOutput = GeneratedReport & {
  searchResults: SearchResult[]
  featuredImage?: string
  generationOptions?: object
  id?: string
  categoryId?: string
  slug?: string
}

export async function getSearchResultsByTopic(
  topic: string,
  numberOfSearchQueryVariations: number,
  numberOfWebResultsToInclude: number,
  options?: RegularSearchOptions
) {
  const searchQueries = await generateSearchQueries(
    topic,
    numberOfSearchQueryVariations
  )
  console.log(`🔍 Search Generation:
• Topic: "${topic}"
• Queries Generated: ${searchQueries.length}
• Queries: ${searchQueries.join(' | ')}`)
  if (!options) {
    options = {}
  }
  options.numResults = numberOfWebResultsToInclude

  const searchResults = await getSearchResults(searchQueries, options)

  console.log(`📊 Search Results:
• Results Found: ${searchResults.length}
• Top Sources: ${searchResults.slice(0,3).map(r => r.url).join('\n  ')}`)
  return searchResults
}
function isUrl(str: string) {
  try {
    new URL(str)
    return true
  } catch (e) {
    return false
  }
}

export type WriteArticleOptions = {
  numberOfSearchQueryVariations?: number
  numberOfWebResultsToInclude?: number
  audience?: string
  purpose?: string
  maxCharactersOfSearchContentToUse?: number
  tone?: string
  format?: "article" | "bullet-points" | "Q&A"
  wordLimit?: number
  includeSummary?: boolean
  languageLevel?: "beginner" | "intermediate" | "advanced" | "expert"
  citationStyle?: "footnote" | "hyperlinked-text" | "endnotes"
  modelName?: ModelName
  status?: ArticleStatus
  temperature?: number
  topP?: number
  maxTokens?: number
  presencePenalty?: number
  frequencyPenalty?: number
  searchStrategy?: "broad" | "focused" | "recent"
  dateRangeStart?: Date
  dateRangeEnd?: Date
  minSourceRank?: number
  categoryName?: string
}

function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export async function writeArticle(
  topic: string,
  userId: string,
  options: WriteArticleOptions = {}
): Promise<ArticleWithRelations> {
  const {
    numberOfSearchQueryVariations = 1,
    numberOfWebResultsToInclude = 10,
    audience = "general",
    purpose = "inform",
    maxCharactersOfSearchContentToUse = 999999,
    tone = "neutral",
    format = "article",
    wordLimit,
    includeSummary = false,
    languageLevel = "intermediate",
    citationStyle = "hyperlinked-text",
    status = ArticleStatus.DRAFT,
    temperature,
    topP,
    maxTokens,
    presencePenalty,
    frequencyPenalty,
    searchStrategy,
    dateRangeStart,
    dateRangeEnd,
    minSourceRank,
  } = options

  console.log(`🚀 Starting Article Generation:
• Topic: "${topic}"
• Model: ${options.modelName || DEFAULT_MODEL_NAME}
• Format: ${format}
• Sources: ${numberOfWebResultsToInclude}`)

  let searchResults: SearchResult[]
  if (isUrl(topic)) {
    searchResults = await getSearchResultsByUrl(
      topic,
      numberOfWebResultsToInclude
    )
  } else {
    searchResults = await getSearchResultsByTopic(
      topic,
      numberOfSearchQueryVariations,
      numberOfWebResultsToInclude
    )
  }

  console.log("Synthesizing report...")

  const model: LanguageModelV1 = getModel(options.modelName)

  let inputData = searchResults
    .map(
      (item) => `--START ITEM: ${item.title}--\n
    TITLE: ${item.title}\n
    URL: ${item.url}\n
    CONTENT: ${item.text.slice(0, maxCharactersOfSearchContentToUse)}\n
    --END ITEM: ${item.title}--\n`
    )
    .join("")

  // strip numerical footnote brackets from the text like [1] or [12], etc
  inputData = inputData.replace(/\[\d+]/g, "")

  let citationInstructions = ""
  if (citationStyle === "footnote") {
    citationInstructions =
      "Provide citations in the text using markdown footnote notation like [^1]."
  } else if (citationStyle === "hyperlinked-text") {
    citationInstructions = `'YOU MUST HYPERLINK THE RELEVANT text in the report to the source 
    URLs used using markdown hyperlink notation 
    like [text](https://link-where-you-got-the-information).';`
  }

  const prompt = `
    Write an extremely information-dense and comprehensive ${format} on the topic of "${topic}" based on the Web Search Results below.
    
    # Guidelines
    
    Avoid fluff and filler content. Focus on providing the most relevant and useful information.
    DO NOT include the title in the content.
    Be as quantitative and data-driven as possible!  
    Use tables as much as appropriate.
    If the topic is a question with a quantitative answer, please answer in the first sentence.
    Separate sections with headings.
    
    Audience: ${audience}
    Purpose: ${purpose}
    Tone: ${tone}
    Language Level: ${languageLevel}
    Citation Style: ${citationInstructions}
    ${wordLimit ? `Word Limit: ${wordLimit} words` : ""}
    ${includeSummary ? "Include a brief summary at the beginning." : ""}

# Web Search Results
    Here is a list of web pages and excerpts from them that you can use to write the report:
    ${inputData}
  `

  const startTime = Date.now()

  const result = await generateObject({
    model: model,
    schema: GeneratedReportSchema,
    prompt,
    experimental_telemetry: { isEnabled: true },
  })

  console.log("Article generated successfully!", result.object)

  const report = result.object as unknown as ReportOutput
  if(options.categoryName) {
    report.categoryName = options.categoryName
  }
  report.tags = report.tags.map(tag => toTitleCase(tag));
  report.searchResults = searchResults
  report.generationOptions = options

  // Calculate token usage and costs
  const modelName = options.modelName || DEFAULT_MODEL_NAME
  const pricing = MODEL_PRICING[modelName] || { input: 0, output: 0 }
  
  const tokenUsage = {
    completionTokens: result.usage?.completionTokens || 0,
    promptTokens: result.usage?.promptTokens || 0,
    totalTokens: result.usage?.totalTokens || 0
  }

  // Calculate cost in USD
  const estimatedCost = 
    (tokenUsage.promptTokens / 1000 * pricing.input) +
    (tokenUsage.completionTokens / 1000 * pricing.output)

  // Find or create category
  let category = await prisma.articleCategory.findFirst({
    where: {
      name: {
        equals: report.categoryName,
        mode: "insensitive",
      },
    },
  })

  if (!category) {
    category = await prisma.articleCategory.create({
      data: {
        name: report.categoryName,
        slug: slugify(report.categoryName),
      },
    })
  }

  // Get or create tags (with title case)
  const tagObjects = await Promise.all(
    report.tags.map(async (tagName) => {
      const titleCaseTagName = toTitleCase(tagName);
      const existingTag = await prisma.articleTag.findFirst({
        where: { name: { equals: titleCaseTagName, mode: "insensitive" } },
      })

      if (existingTag) {
        return existingTag
      } else {
        return prisma.articleTag.create({
          data: { 
            name: titleCaseTagName, 
            slug: slugify(titleCaseTagName) 
          },
        })
      }
    })
  )

  let slug = slugify(report.title + "-prompt-" + topic)
  if(topic === report.title) {
    slug = slugify(report.title)
  }

  console.log(`Saving article to database...
• Title: "${report.title}"
• Slug: "${slug}"
• Category: "${report.categoryName}"
• Tags: ${report.tags.join(', ')}
• Sources: ${report.sources.length}`)
    

  // Save the article to the database
  const savedArticle = await prisma.article.create({
    data: {
      title: report.title,
      slug,
      description: report.description,
      content: report.content,
      status: status as ArticleStatus,
      visibility: "PUBLIC",
      promptedTopic: topic,
      featuredImage: report.featuredImage,
      userId: userId,
      categoryId: category.id,
      tags: {
        connect: tagObjects.map((tag) => ({ id: tag.id })),
      },
      sources: {
        create: report.sources.map((source) => ({
          url: source.url,
          title: source.title,
          description: source.description,
        })),
      },
      searchResults: {
        create: report.searchResults.map((result) => ({
          score: result.score || 0,
          title: result.title || "",
          url: result.url,
          publishedDate: result.publishedDate || null,
          author: result.author || null,
          text: result.text,
        })),
      },
      generationOptions: {
        create: {
          numberOfSearchQueryVariations:
            options.numberOfSearchQueryVariations || 1,
          numberOfWebResultsToInclude:
            options.numberOfWebResultsToInclude || 10,
          audience: options.audience || "general",
          purpose: options.purpose || "inform",
          maxCharactersOfSearchContentToUse:
            options.maxCharactersOfSearchContentToUse || 999999,
          tone: options.tone || "neutral",
          format: options.format || "article",
          modelName: options.modelName || DEFAULT_MODEL_NAME,
          temperature: options.temperature,
          topP: options.topP,
          maxTokens: options.maxTokens,
          presencePenalty: options.presencePenalty,
          frequencyPenalty: options.frequencyPenalty,
          searchStrategy: options.searchStrategy,
          dateRangeStart: options.dateRangeStart,
          dateRangeEnd: options.dateRangeEnd,
          minSourceRank: options.minSourceRank,
          citationStyle: options.citationStyle,
          languageLevel: options.languageLevel,
          wordLimit: options.wordLimit,
          includeSummary: options.includeSummary,
          generationTimeMs: Date.now() - startTime,
          tokenCount: tokenUsage.totalTokens,
          estimatedCost,
          qualityScore: null,
        },
      },
    },
    include: {
      user: true,
      category: true,
      tags: true,
      sources: true,
      searchResults: true,
      generationOptions: true,
      comments: true,
    },
  })

  console.log(`✅ Generation Complete:
• Title: "${report.title}"
• Category: ${report.categoryName}
• Tags: ${report.tags.join(', ')}
• Sources Used: ${report.sources.length}
• Time: ${((Date.now() - startTime) / 1000).toFixed(2)}s
• Tokens: ${tokenUsage.totalTokens.toLocaleString()}
• Cost: $${estimatedCost.toFixed(4)}`)

  console.log(`💾 Article Saved:
• ID: ${savedArticle.id}
• Slug: ${savedArticle.slug}
• Status: ${savedArticle.status}`)

  return savedArticle
}

export type ArticleWithRelations = Prisma.ArticleGetPayload<{
  include: {
    user: true
    category: true
    tags: true
    sources: true
    searchResults: true
    generationOptions: true
    comments: true
  }
}>

export async function findOrCreateArticleByPromptedTopic(
  promptedTopic: string,
  userId: string = "test-user",
  options: WriteArticleOptions = {}
): Promise<ArticleWithRelations> {
  let article: ArticleWithRelations | null
  if (userId) {
    article = await prisma.article.findFirst({
      where: {
        promptedTopic: promptedTopic,
        userId: userId,
      },
      include: {
        user: true,
        category: true,
        tags: true,
        sources: true,
        searchResults: true,
        generationOptions: true,
        comments: true,
      },
    })
  } else {
    article = await prisma.article.findFirst({
      where: {
        promptedTopic: promptedTopic,
      },
      include: {
        user: true,
        category: true,
        tags: true,
        sources: true,
        searchResults: true,
        generationOptions: true,
        comments: true,
      },
    })
  }
  if (article) {
    return article
  }
  const generatedReport = await writeArticle(promptedTopic, userId, options)
  article = await prisma.article.findUnique({
    where: {
      id: generatedReport.id,
    },
    include: {
      user: true,
      category: true,
      tags: true,
      sources: true,
      searchResults: true,
      generationOptions: true,
      comments: true,
    },
  })

  if (!article) {
    throw new Error(`Article not found after creation: ${generatedReport.id}`)
  }

  return article
}

export async function deleteArticleByPromptedTopic(
  promptedTopic: string,
  userId: string
): Promise<void> {
  // Find the article(s) to delete
  const articlesToDelete = await prisma.article.findMany({
    where: {
      promptedTopic: promptedTopic,
      userId: userId,
    },
    select: { id: true },
  })

  // Delete related records and the article itself in a transaction
  await prisma.$transaction(async (tx) => {
    for (const article of articlesToDelete) {
      // Delete related records
      await tx.articleSource.deleteMany({ where: { articleId: article.id } })
      await tx.articleSearchResult.deleteMany({
        where: { articleId: article.id },
      })
      await tx.articleGenerationOptions.deleteMany({
        where: { articleId: article.id },
      })

      // Delete the article
      await tx.article.delete({ where: { id: article.id } })
    }
  })
}

export async function findArticleByTopic(
  promptedTopic: string,
  userId?: string
): Promise<ArticleWithRelations | null> {
  return prisma.article.findFirst({
    where: {
      promptedTopic: promptedTopic,
      ...(userId ? { userId } : {}),
    },
    include: {
      user: true,
      category: true,
      tags: true,
      sources: true,
      searchResults: true,
      generationOptions: true,
      comments: true,
    },
  })
}

export async function getArticleBySlug(slug: string) {
  return prisma.article.findUnique({
    where: {
      slug: slug,
    },
    include: {
      user: true,
      category: true,
      tags: true,
      sources: true,
      searchResults: true,
      generationOptions: true,
      comments: true,
    },
  })
}
