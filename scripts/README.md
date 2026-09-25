# CLI Scripts

Scripts in this directory automate tasks outside the running app. Run the
TypeScript ones with `pnpm tsx scripts/<file>.ts`, which resolves the `@/`
path alias from the root `tsconfig.json`.

- `run-next.js` wraps the Next.js CLI for the `dev`, `build`, and `start`
  scripts.
- `generateRouteTree.ts` regenerates `config/routeTree.ts`
  (`pnpm generate-routes`), which `app/sitemap.ts` reads.
- `warImageGenerator.js` regenerates `lib/warImagePaths.js` from
  `public/img/war` (`pnpm generate:war-images`).
- `dumpDatabase.ts` writes the sample data back to `prisma/seeds/*.json`,
  which `pnpm prisma:seed` loads (`pnpm db:dump`). `pnpm db:dump --full`
  backs up every table to `prisma/backups/<date>/` instead.
