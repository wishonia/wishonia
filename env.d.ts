// env.d.ts
// This is kind of hack to make the IDE stop complaining about:
// TS2339: Property NEXT_PUBLIC_APP_URL does not exist on type Readonly<{}>.
interface Env {
  TEST_DOMAIN: string
  NODE_ENV: string
  // Add other environment variables as needed
  NEXT_PUBLIC_APP_URL: string
  NEXT_PUBLIC_SITE_NAME: string
  NEXT_PUBLIC_SITE_DESCRIPTION: string
  NEXT_PUBLIC_SITE_AUTHOR: string
  NEXT_PUBLIC_SITE_KEYWORDS: string
  NEXT_PUBLIC_SITE_OG_IMAGE: string
  NEXT_PUBLIC_API_KEY: string
  NEXT_PUBLIC_API_URL: string
  NEXTAUTH_URL: string
  NEXTAUTH_SECRET: string
  GOOGLE_CLIENT_ID: string
  GOOGLE_CLIENT_SECRET: string
  GITHUB_CLIENT_ID: string
  GITHUB_CLIENT_SECRET: string
  DATABASE_URL: string
  EMAIL_SERVER: string
  EMAIL_FROM: string
  DFDA_CLIENT_ID: string
  DFDA_CLIENT_SECRET: string
  STRIPE_SECRET_KEY: string
  STRIPE_WEBHOOK_SECRET: string
}

declare module "@t3-oss/env-nextjs" {
  export function createEnv(config: any): Env
}
