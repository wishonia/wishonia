import { writeArticle, WriteArticleOptions } from "@/lib/agents/researcher/researcher";
import { ArticleStatus, PrismaClient } from "@prisma/client";
import { generateMetaAnalysisQuery } from './metaAnalysisQueries';

const prisma = new PrismaClient();

export type Treatment = string;

export type MetaAnalysisOptions = {
  condition: string;
  treatments: Treatment[];
  userId: string;
  researchOptions?: WriteArticleOptions;
};

export type TreatmentAnalysis = {
  treatment: string;
  articleId: string;
  title: string;
  description: string;
  content: string;
};

export type MetaAnalysisResult = {
  condition: string;
  treatmentAnalyses: TreatmentAnalysis[];
};

async function findExistingArticle(searchQuery: string, userId: string) {
  return prisma.article.findFirst({
    where: {
      promptedTopic: {
        contains: searchQuery,
        mode: 'insensitive',
      }
    },
    include: {
      category: true,
      tags: true,
      sources: true,
    },
  });
}

export async function generateMetaAnalysis({
  condition,
  treatments,
  userId,
  researchOptions = {},
}: MetaAnalysisOptions): Promise<MetaAnalysisResult> {
  const treatmentAnalyses: TreatmentAnalysis[] = [];
  const categoryName = `${condition} Treatments`;

  // Research each treatment
  for (const treatment of treatments) {
    const defaultOptions: WriteArticleOptions = {
      numberOfSearchQueryVariations: 1,
      numberOfWebResultsToInclude: 10,
      citationStyle: "hyperlinked-text",
      purpose: `
    Analyze the effectiveness of ${treatment} for treating ${condition}, focusing on patient outcomes. 
    
    Please include the following if available:

    ## Treatment Effectiveness Summary

    - Overall success rate
    - Time to see results
    - How long benefits typically last
    - Number of patients studied
    - Quality of evidence]

    ## Comparison to Other Treatments
    - How it compares to other common treatments

        ## Cost-Effectiveness
        - Average treatment cost
        - Insurance coverage
        - Availability


        Guidelines:
        - Present all statistics in easy-to-understand tables
        - Use percentages and simple ratios when possible
        - Always indicate how reliable the evidence is
        - Focus on real-world patient outcomes
        - Include sample sizes for context
        - Highlight any limitations in the evidence
        
        Tables should generally use this format:
        | Measure | Result | Reliability of Evidence |
        |---------|---------|------------------------|
        | Data    | Value   | High/Moderate/Low      |
      `,
      ...researchOptions,
    };

    const searchQuery = generateMetaAnalysisQuery(treatment, condition);
    
    console.log(`Checking for existing analysis of ${treatment} for ${condition}...`);
    
    const existingArticle = await findExistingArticle(searchQuery, userId);
    
    if (existingArticle) {
      console.log(`Found existing analysis for ${treatment}`);
      treatmentAnalyses.push({
        treatment,
        articleId: existingArticle.id,
        title: existingArticle.title,
        description: existingArticle.description,
        content: existingArticle.content,
      });
      continue;
    }

    console.log(`Generating new analysis for ${treatment}...`);

    const article = await writeArticle(
      searchQuery,
      userId,
      {
        ...defaultOptions,
        status: ArticleStatus.PUBLISH,
        categoryName
      }
    );

    treatmentAnalyses.push({
      treatment,
      articleId: article.id,
      title: article.title,
      description: article.description,
      content: article.content,
    });
  }

  return {
    condition,
    treatmentAnalyses,
  };
}

export async function getMetaAnalysisByCondition(condition: string): Promise<MetaAnalysisResult | null> {
  const articles = await prisma.article.findMany({
    where: {
      promptedTopic: {
        contains: condition,
        mode: 'insensitive'
      }
    },
    include: {
      category: true,
      tags: true,
      sources: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  if (articles.length === 0) return null;

  const treatmentAnalyses = articles.map(article => ({
    treatment: article.title.split('for')[0].trim(),
    articleId: article.id,
    title: article.title,
    description: article.description,
    content: article.content,
  }));

  return {
    condition,
    treatmentAnalyses,
  };
} 