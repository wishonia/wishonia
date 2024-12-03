/**
 * @jest-environment node
 */
import { getModel } from '@/lib/utils/modelUtils';
import { z } from 'zod'
import { generateObject } from 'ai'

describe("Generate Object tests", () => {
  jest.setTimeout(6000000)

  it("generates an object based on schema", async () => {

    // Define a sample schema for testing
    const TestSchema = z.object({
      name: z.string().describe("A name for the item"),
      description: z.string().describe("A detailed description"),
      tags: z.array(z.string()).describe("Related tags"),
      rating: z.number().min(0).max(5).describe("Rating from 0-5")
    });

    const userPrompt = 
      `Generate information about a random product.`;
  
    const result = await generateObject({
      model: getModel(),
      schema: TestSchema,
      prompt: userPrompt,
    });
  
    // Test the shape of the returned object
    expect(result.object).toHaveProperty('name');
    expect(result.object).toHaveProperty('description');
    expect(Array.isArray(result.object.tags)).toBe(true);
    expect(typeof result.object.rating).toBe('number');
    expect(result.object.rating).toBeGreaterThanOrEqual(0);
    expect(result.object.rating).toBeLessThanOrEqual(5);
  });
});
