# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/scripts exec tsx /home/runner/workspace/lib/db/src/seed-videos.ts` — seed videos table

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifact: Btachon (Jewish Personal Growth App)

**Stack**: React + Vite, Tailwind v4, shadcn/ui, framer-motion, wouter, @tanstack/react-query, Lucide, Replit Auth OIDC, PostgreSQL via drizzle-orm

**Theme**: Dark mode, warm amber accent (HSL 35 65% 62%) on charcoal. No emojis, no green, Lucide icons only.

**Nav**: Home (dashboard), Pulse, Learn, Grow, Connect, Nitzotz — bottom bar (mobile 6), sidebar (desktop)

**Pages**:
- `dashboard.tsx` — Greeting + streak, hero card (Mitzvah/Geulah/Quote flip), 4 mission checklist rows
- `nitzotz.tsx` — TikTok-style vertical snap-scroll video feed; fetches from `/api/videos` (DB-backed, 14 seeded)
- `learn.tsx`, `grow.tsx`, `pulse.tsx`, `chevre.tsx`, `connect.tsx`, `settings.tsx`, `blocker.tsx`

**Database tables**: `users`, `sessions`, `profiles`, `friends`, `videos`

**Video system**: `lib/db/src/schema/videos.ts` → DB table; `/api/videos` GET (public) / POST+DELETE (auth); `useListVideos` hook from generated API client. 14 videos seeded in DB.

**Codegen quirk**: `lib/api-zod/tsconfig.json` must NOT have `"exclude": ["src/generated/types"]`. Orval zod config uses `indexFiles: false` to prevent regenerating `src/index.ts`. The `lib/api-zod/src/index.ts` only exports from `./generated/api` (not types — they would duplicate names).

**localStorage keys** (all prefixed `btachon:`): `profileType`, `mitzvahCompletions`, `savedVideos`, `shabbosLocation`, `chaiStreak`, `savedMitzvos`
