/**
 * @jest-environment node
 */
import { searchImages } from "@/lib/utils/imageSearch"

describe("Image Search tests", () => {
  jest.setTimeout(30000) // 30 second timeout

  it("finds images for a scientific query", async () => {
    const query = "IDO1 enzyme structure diagram"
    const results = await searchImages(query, { num: 1 })

    // Check that we got results
    expect(Array.isArray(results)).toBe(true)
    expect(results.length).toBeGreaterThan(0)

    const firstResult = results[0]

    // Check the structure of the result
    expect(firstResult).toHaveProperty('link')
    expect(firstResult).toHaveProperty('image.thumbnailLink')
    expect(firstResult).toHaveProperty('title')
    expect(firstResult).toHaveProperty('image.contextLink')

    // Verify URL formats
    expect(firstResult.link).toMatch(/^https?:\/\//)
    expect(firstResult.image.thumbnailLink).toMatch(/^https?:\/\//)
    expect(firstResult.image.contextLink).toMatch(/^https?:\/\//)

    // Optional: Log the result for manual inspection
    console.log("Image search result:", JSON.stringify(firstResult, null, 2))
  })

  it("finds diagrams for technical topics with custom parameters", async () => {
    const query = "machine learning neural network architecture diagram"
    const results = await searchImages(query, {
      num: 5,
      imgSize: 'large'
    })
    
    expect(Array.isArray(results)).toBe(true)
    expect(results.length).toBeGreaterThan(0)
    
    const firstResult = results[0]
    expect(firstResult.link).toMatch(/^https?:\/\//)
    
    // The title should probably contain relevant keywords
    expect(firstResult.title.toLowerCase()).toMatch(/neural|network|architecture|diagram/i)

    // Check that we got the requested number of results (or less if not enough found)
    expect(results.length).toBeLessThanOrEqual(5)
  })

}) 