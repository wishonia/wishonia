import * as z from "zod"

export const userNameSchema = z.object({
  username: z.string().min(3).max(32).regex(/^[A-Za-z0-9_]{1,15}$/,
      "No spaces or special characters, please!"),
})
