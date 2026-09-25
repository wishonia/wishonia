/**
 * @jest-environment node
 */
import { createSlug } from "@/lib/stringHelper"

// Global problems and solutions use createSlug(name) as their primary key,
// so any change to its output would orphan existing rows.
describe("createSlug", () => {
  it.each([
    ["Climate Change", "climate-change"],
    ["Hello, World!", "hello-world"],
    ["  Leading and trailing  ", "leading-and-trailing"],
    ["Cure 2 Cancer", "cure-2-cancer"],
    ["already-a-slug", "already-a-slug"],
    ["Mixed---Dashes__and  spaces", "mixed-dashes-and-spaces"],
  ])("turns %p into %p", (input, slug) => {
    expect(createSlug(input)).toBe(slug)
  })

  it("drops letters outside a-z", () => {
    expect(createSlug("Über Café")).toBe("ber-caf")
  })
})
