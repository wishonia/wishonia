// env.d.ts
// This is kind of hack to make the IDE stop complaining about:
// TS2339: Property NEXT_PUBLIC_APP_URL does not exist on type Readonly<{}>.
interface Env {
  NODE_ENV: string
  // Add other environment variables as needed
  NEXT_PUBLIC_APP_URL: string
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
}

declare module "@t3-oss/env-nextjs" {
  export function createEnv(config: any): Env
}
