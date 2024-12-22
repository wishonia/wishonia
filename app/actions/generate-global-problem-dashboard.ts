'use server'

import { generateObject } from 'ai'
import { getModel } from '@/lib/utils/modelUtils'
import { GlobalProblemDashboardData, GlobalProblemDashboardSchema } from "@/lib/schemas/global-problem-dashboard"
import { getRedisModelCache } from '@/lib/utils/redis'
import prisma from '@/lib/prisma'
import { getGlobalProblemRelationships } from '@/lib/queries/globalProblemQueries'
import type { GlobalProblemRelationships } from '@/lib/queries/globalProblemQueries'

const CACHE_TTL = 60 * 60 * 24 // 24 hours in seconds
const CACHE_KEY_PREFIX = 'global-problem-dashboard:'

export async function generateGlobalProblemDashboard(problemName: string): Promise<GlobalProblemDashboardData> {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('🤖 [LLM] Generating dashboard data for:', problemName)
    }

    // Initialize Redis cache with TTL
    const cache = getRedisModelCache(CACHE_TTL)
    const cacheKey = `${CACHE_KEY_PREFIX}${problemName.toLowerCase()}`

    // Try to get from cache first
    const cachedData = await cache.lookup(cacheKey)
    if (cachedData) {
      if (process.env.NODE_ENV === 'development') {
        console.log('📦 [Cache] Found cached dashboard data for:', problemName)
      }
      //return JSON.parse(cachedData) as GlobalProblemDashboardData
    }

    // If not in cache, generate new data
    const prompt = `Generate comprehensive dashboard data about the global problem of ${problemName}. 
      Include factual, well-researched information for:
      
      1. Overview of the problem and current solutions being developed
      2. Key organizations working on this problem (with real organization details)
      3. Key people/researchers in the field (with real researcher details)
      4. Historical timeline of major breakthroughs and developments
      5. Active discussion topics and debates
      6. Research funding distribution across different areas
      
      Make all data realistic, fact-based, and properly formatted according to the schema.
      Ensure section titles are exactly: 'Overview' or 'Current Solutions'.`

    if (process.env.NODE_ENV === 'development') {
      console.log('📝 [LLM] Dashboard prompt:', prompt)
    }

    const result = await generateObject({
      model: getModel(),
      schema: GlobalProblemDashboardSchema,
      prompt: prompt,
    })

    if (process.env.NODE_ENV === 'development') {
      console.log('✅ [LLM] Generated dashboard data successfully')
    }

    const data = result.object

    // First, get or create the global problem
    const globalProblem = await prisma.globalProblem.upsert({
      where: { name: problemName },
      create: {
        name: problemName,
        userId: 'system',
      },
      update: {}
    })

    // Cache the result
    await cache.update(cacheKey, JSON.stringify(data))
    if (process.env.NODE_ENV === 'development') {
      console.log('💾 [Cache] Updated cache for:', problemName)
    }

    return data
  } catch (error) {
    console.error('❌ [LLM] Error generating dashboard data:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to generate dashboard data')
  }
}

export async function getGlobalProblemRelationshipsAction(
  problemId: string
): Promise<GlobalProblemRelationships> {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 [Query] Getting relationships for problem:', problemId)
    }
    const relationships = await getGlobalProblemRelationships(problemId)
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ [Query] Found relationships:', {
        organizations: relationships.organizations.length,
        people: relationships.people.length,
        total: relationships.total
      })
    }
    return relationships
  } catch (error) {
    console.error('❌ [Query] Error getting problem relationships:', error)
    throw new Error('Failed to get problem relationships')
  }
}