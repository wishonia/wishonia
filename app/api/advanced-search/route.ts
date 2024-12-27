import { NextResponse } from 'next/server'

import { advancedSearchXNGSearch } from '@/lib/search/searxng'
import { CacheService } from '@/lib/services/cache-service'
import {
  SearXNGSearchResults,
} from '@/lib/types/index'

/**
 * Maximum number of results to fetch from SearXNG.
 * Increasing this value can improve result quality but may impact performance.
 * In advanced search mode, this is multiplied by SEARXNG_CRAWL_MULTIPLIER for initial fetching.
 */
const SEARXNG_MAX_RESULTS = Math.max(
  10,
  Math.min(100, parseInt(process.env.SEARXNG_MAX_RESULTS || '50', 10))
)

export async function POST(request: Request) {
  const { query, maxResults, searchDepth, includeDomains, excludeDomains } =
    await request.json()

  const SEARXNG_DEFAULT_DEPTH = process.env.SEARXNG_DEFAULT_DEPTH || 'basic'
  const cacheService = CacheService.getInstance()

  try {
    const cacheKey = `search:${query}:${maxResults}:${searchDepth}:${
      Array.isArray(includeDomains) ? includeDomains.join(',') : ''
    }:${Array.isArray(excludeDomains) ? excludeDomains.join(',') : ''}`

    // Try to get cached results
    const cachedResults = await cacheService.get<SearXNGSearchResults>(cacheKey)
    if (cachedResults) {
      return NextResponse.json(cachedResults)
    }

    // If not cached, perform the search
    const results = await advancedSearchXNGSearch(
      query,
      Math.min(maxResults, SEARXNG_MAX_RESULTS),
      searchDepth || SEARXNG_DEFAULT_DEPTH,
      Array.isArray(includeDomains) ? includeDomains : [],
      Array.isArray(excludeDomains) ? excludeDomains : []
    )

    // Cache the results
    await cacheService.set(cacheKey, results)

    return NextResponse.json(results)
  } catch (error) {
    console.error('Advanced search error:', error)
    return NextResponse.json(
      {
        message: 'Internal Server Error',
        error: error instanceof Error ? error.message : String(error),
        query: query,
        results: [],
        images: [],
        number_of_results: 0
      },
      { status: 500 }
    )
  }
}
