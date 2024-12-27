import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    NEXTAUTH_URL: z.string().url().optional(),
    NEXTAUTH_SECRET: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
    DATABASE_URL: z.string().min(1),
    EMAIL_SERVER: z.string().min(1),
    EMAIL_FROM: z.string().min(1),
    TEST_DOMAIN: z.string().optional(),
    DFDA_CLIENT_ID: z.string().min(1),
    DFDA_CLIENT_SECRET: z.string().min(1),
    STRIPE_SECRET_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().min(1),
    NEXT_PUBLIC_SITE_NAME: z.string().optional(),
    NEXT_PUBLIC_SITE_DESCRIPTION: z.string().optional(),
    NEXT_PUBLIC_SITE_AUTHOR: z.string().optional(),
    NEXT_PUBLIC_SITE_KEYWORDS: z.string().optional(),
    NEXT_PUBLIC_SITE_OG_IMAGE: z.string().url().optional(),
    NEXT_PUBLIC_TEST_DOMAIN: z.string().optional(),
  },
  runtimeEnv: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
    NEXT_PUBLIC_SITE_DESCRIPTION: process.env.NEXT_PUBLIC_SITE_DESCRIPTION,
    NEXT_PUBLIC_SITE_AUTHOR: process.env.NEXT_PUBLIC_SITE_AUTHOR,
    NEXT_PUBLIC_SITE_KEYWORDS: process.env.NEXT_PUBLIC_SITE_KEYWORDS,
    NEXT_PUBLIC_SITE_OG_IMAGE: process.env.NEXT_PUBLIC_SITE_OG_IMAGE,
    EMAIL_SERVER: process.env.EMAIL_SERVER,
    EMAIL_FROM: process.env.EMAIL_FROM,
    TEST_DOMAIN: process.env.TEST_DOMAIN,
    NEXT_PUBLIC_TEST_DOMAIN: process.env.NEXT_PUBLIC_TEST_DOMAIN,
    DFDA_CLIENT_ID: process.env.DFDA_CLIENT_ID,
    DFDA_CLIENT_SECRET: process.env.DFDA_CLIENT_SECRET,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  },
})
