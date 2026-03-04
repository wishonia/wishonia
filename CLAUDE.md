# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Wishonia is a full-stack Next.js 14 application (App Router) implementing a "Decentralized To-Do List for Humanity" — a platform for collective intelligence around solving global problems via pairwise preference allocation, AI agents, and task decomposition.

## Commands

```bash
pnpm dev              # Start dev server
pnpm turbo            # Start dev server with Turbo
pnpm build            # Production build
pnpm lint             # ESLint
pnpm type-check       # TypeScript type checking (tsc --noEmit)
pnpm format           # Prettier format all files
pnpm test             # Jest in watch mode
pnpm test:ci          # Jest single run (CI)
pnpm db:up            # Start PostgreSQL + Redis + SearXNG via Docker
pnpm prisma:migrate   # Run Prisma migrations
pnpm prisma:studio    # Open Prisma Studio (database browser)
pnpm prisma:generate  # Regenerate Prisma client
pnpm prisma:seed      # Seed database
pnpm prisma:reset     # Reset database (destructive)
```

Run a single test: `pnpm jest tests/my-test.test.ts`

## Tech Stack

- **Framework**: Next.js 14.2 (App Router), React 18, TypeScript 5.3
- **Package manager**: pnpm
- **Database**: PostgreSQL (pgvector via Docker on port 5433), Prisma ORM
- **Auth**: NextAuth.js 4 with JWT strategy, PrismaAdapter (Google, GitHub, Email magic links, DFDA OAuth)
- **State**: Zustand (client state), React Query (server state)
- **UI**: Tailwind CSS, shadcn/ui (Radix UI primitives), Framer Motion
- **AI**: Vercel AI SDK with OpenAI/Anthropic/Google/Azure/Ollama providers, LangChain, CopilotKit
- **Testing**: Jest (unit), Playwright (E2E)
- **Infra**: Vercel deployment, Sentry error tracking, Stripe payments, Redis caching

## Architecture

### App Router Conventions

- `app/**/page.tsx` — Server components by default. **Never** add `'use client'` to page files.
- `app/**/components/*.tsx` — Client components co-located with features.
- `components/**/*.tsx` — Shared reusable client components (shadcn/ui pattern).
- API routes live in `app/api/**/route.ts`.

### Key Directories

| Path | Purpose |
|------|---------|
| `lib/auth.ts` | NextAuth configuration and `authOptions` |
| `lib/db.ts` | Prisma client singleton |
| `lib/store.ts` | Zustand stores |
| `lib/logger.ts` | Structured logger (wraps Sentry) |
| `lib/actions/` | Server actions |
| `lib/agents/` | AI agent utilities |
| `lib/validations/` | Zod schemas for API validation |
| `lib/hooks/` | Custom React hooks |
| `config/` | Site config, navigation, domain config |
| `prisma/` | Schema, migrations, seed |
| `env.mjs` | T3 Env validation (Zod-validated env vars) |
| `middleware.ts` | Auth guards, redirects, domain routing |

### Auth Patterns

Server components:
```ts
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
const session = await getServerSession(authOptions)
```

Client components:
```ts
import { useSession } from "next-auth/react"
const { data: session } = useSession()
```

### Database

Prisma schema at `prisma/schema.prisma`. Key models: User, Agent, GlobalProblem, GlobalSolution, GlobalTask, WishingWell, Chat, Article. Always import types from `@prisma/client` rather than creating duplicates.

### Environment Variables

Validated via `@t3-oss/env-nextjs` in `env.mjs`. Required server vars: `NEXTAUTH_SECRET`, `DATABASE_URL`, `GOOGLE_CLIENT_ID/SECRET`, `GITHUB_CLIENT_ID/SECRET`, `DFDA_CLIENT_ID/SECRET`, `EMAIL_SERVER`, `EMAIL_FROM`. See `.env.example` for full list.

## Coding Conventions

- Use `import { logger } from '@/lib/logger'` instead of `console.log/warn/error`. Errors logged via `logger.error()` are auto-sent to Sentry.
- Use `@/` path alias for all imports (maps to project root).
- Prefer Prisma types from `@prisma/client` over custom type definitions.
- Use Zod schemas in `lib/validations/` for API input validation.
- Tests: add `/** @jest-environment node */` at top of test files. Write tests that can safely run against production — prefer real implementations over mocks.
