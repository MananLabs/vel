# VEL AI — Commands & Conventions

## Build
```bash
npm run build              # Full monorepo build (shared + api + web)
npm run build --workspace=@vel-ai/api   # API only
npm run build --workspace=@vel-ai/web   # Web only
```

## Dev
```bash
npm run dev                # All workspaces (turbo)
npm run dev:backend        # API only (port 3001)
npm run dev:frontend       # Web only (port 3000)
```

## Test
```bash
npm run test --workspace=@vel-ai/api     # All API tests
npm run test --workspace=@vel-ai/api --   # Watch mode
npm run test --workspace=@vel-ai/api -- src/auth/auth.service.spec.ts  # Single file
```

## Lint (type-check)
```bash
npm run lint               # tsc --noEmit for all packages
```

## Database
```bash
npm run db:generate        # Generate Drizzle migrations
npm run db:migrate         # Apply migrations
npm run db:studio          # Open Drizzle Studio (port 4983)
```

## Docker
```bash
docker build -t vel-ai-api .          # Build production image
docker run -p 3001:3001 --env-file .env vel-ai-api
```

## Conventions
- TypeScript strict mode — zero `any`, zero `// @ts-ignore`
- No eslint — type-check via `tsc --noEmit`
- JWT auth with httpOnly cookies, no external providers
- PostgreSQL via Drizzle ORM, Upstash Redis for ephemeral state
- Tests live next to source: `src/**/*.spec.ts`
