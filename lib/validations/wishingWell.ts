import * as z from "zod"

export const wishingWellPatchSchema = z.object({
  name: z.string().min(3).max(32),
  description: z.string().max(128).optional(),
})
