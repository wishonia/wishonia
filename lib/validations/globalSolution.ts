import * as z from "zod"

export const globalSolutionPatchSchema = z.object({
  name: z.string().min(3).max(64),
  description: z.string().max(240).optional(),
  content: z.string().max(30000).optional(),
})

export const globalSolutionSchema = z.object({
  name: z.string().min(3).max(64),
  description: z.string().max(240).optional(),
  content: z.string().max(30000).optional(),
})
