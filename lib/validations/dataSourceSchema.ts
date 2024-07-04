import * as z from "zod"

export const dataSourceSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3).max(64),
  content: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  url: z.string().nullable().optional(),
  type: z.string().nullable().optional(),
})

