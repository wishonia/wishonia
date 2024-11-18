/**
 * @jest-environment node
 */
import { advancedSearchXNGSearch } from "@/app/api/advanced-search/route"
import { SearXNGSearchResults } from "@/lib/types/index"
import path from 'path'
import { config } from 'dotenv'
// Load environment variables from .env.local
config({ path: path.resolve(process.cwd(), '.env.local') })

describe("Advanced Search Tests", () => {
  jest.setTimeout(60000) // 1 minute timeout

  it("performs a basic search with default parameters", async () => {
    const query = "artificial intelligence ethics"
    const results = await advancedSearchXNGSearch(query)

    expect(results).toBeDefined()
    expect(results.query).toBe(query)
    expect(Array.isArray(results.results)).toBe(true)
    expect(Array.isArray(results.images)).toBe(true)
    expect(typeof results.number_of_results).toBe('number')

    // Check structure of first result if available
    if (results.results.length > 0) {
      const firstResult = results.results[0]
      expect(firstResult).toHaveProperty('title')
      expect(firstResult).toHaveProperty('url')
      expect(firstResult).toHaveProperty('content')
    }
  })

  it("performs an advanced search with domain filtering", async () => {
    const query = "machine learning"
    const maxResults = 5
    const searchDepth = "advanced"
    const includeDomains = ["arxiv.org"]
    const excludeDomains = ["wikipedia.org"]

    const results = await advancedSearchXNGSearch(
      query,
      maxResults,
      searchDepth,
      includeDomains,
      excludeDomains
    )

    expect(results).toBeDefined()
    expect(results.results.length).toBeLessThanOrEqual(maxResults)

    // Check that results only come from included domains
    results.results.forEach(result => {
      const resultDomain = new URL(result.url).hostname
      expect(includeDomains.some(domain => resultDomain.includes(domain))).toBe(true)
      expect(excludeDomains.some(domain => resultDomain.includes(domain))).toBe(false)
    })
  })

  it("handles searches with special characters", async () => {
    const query = "C++ programming & data structures"
    const results = await advancedSearchXNGSearch(query)

    expect(results).toBeDefined()
    expect(results.query).toBe(query)
    expect(Array.isArray(results.results)).toBe(true)
  })

  it("performs search with maximum results limit", async () => {
    const query = "quantum computing"
    const maxResults = 3
    
    const results = await advancedSearchXNGSearch(query, maxResults)

    expect(results).toBeDefined()
    expect(results.results.length).toBeLessThanOrEqual(maxResults)
  })

  it("returns relevant content for technical queries", async () => {
    const query = "React.js useEffect hook examples"
    const results = await advancedSearchXNGSearch(query, 5, "advanced")

    expect(results).toBeDefined()
    expect(results.results.length).toBeGreaterThan(0)

    // Check that results contain relevant technical content
    const relevantTerms = ["useEffect", "React", "hook", "component"]
    const hasRelevantContent = results.results.some(result => 
      relevantTerms.some(term => 
        result.title.toLowerCase().includes(term.toLowerCase()) ||
        result.content.toLowerCase().includes(term.toLowerCase())
      )
    )
    expect(hasRelevantContent).toBe(true)
  })

  it("handles empty or invalid queries gracefully", async () => {
    const emptyResults = await advancedSearchXNGSearch("")
    expect(emptyResults).toBeDefined()
    expect(emptyResults.results).toEqual([])

    const invalidResults = await advancedSearchXNGSearch("   ")
    expect(invalidResults).toBeDefined()
    expect(invalidResults.results).toEqual([])
  })

  it("returns image results when available", async () => {
    const query = "sunset photography"
    const results = await advancedSearchXNGSearch(query)

    expect(results).toBeDefined()
    expect(Array.isArray(results.images)).toBe(true)

    if (results.images.length > 0) {
      results.images.forEach(imageUrl => {
        expect(typeof imageUrl).toBe('string')
        expect(imageUrl.startsWith('http')).toBe(true)
      })
    }
  })

  it("performs advanced search with content crawling", async () => {
    const query = "latest developments in CRISPR"
    const results = await advancedSearchXNGSearch(query, 5, "advanced")

    expect(results).toBeDefined()
    expect(results.results.length).toBeGreaterThan(0)

    // Check that results have been crawled and processed
    results.results.forEach(result => {
      expect(result.content.length).toBeGreaterThan(0)
      // Check for highlighted terms if query terms are present
      if (result.content.toLowerCase().includes("crispr")) {
        expect(result.content).toMatch(/<mark>.*?<\/mark>/i)
      }
    })
  })
})