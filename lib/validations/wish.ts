import * as z from "zod"

export const wishSchema = z.object({
  wish: z.string().max(30000),
})
