// env.d.ts
// This is kind of hack to make the IDE stop complaining about:
// TS2339: Property NEXT_PUBLIC_APP_URL does not exist on type Readonly<{}>.
interface Env {
  NEXT_PUBLIC_APP_URL: string;
  // Add other environment variables as needed
}

declare module '@t3-oss/env-nextjs' {
  export function createEnv(config: any): Env;
}
