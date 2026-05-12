# VEL AI — The Infinite Multi-Agent AI Operating Workspace

> Run Claude, GPT-4o, and Gemini simultaneously on an infinite canvas. Share context between agents. Ship faster.

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example apps/api/.env
cp .env.example apps/web/.env.local
# Edit both files with your actual keys

# Run development servers
npm run dev
```

## Architecture

```
vel-ai/
├── apps/web/          # Next.js 14 frontend (Vercel)
├── apps/api/          # NestJS backend (Railway)
└── packages/shared/   # Shared TypeScript types
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React Flow, Framer Motion, Zustand |
| Backend | NestJS 10, Drizzle ORM |
| Database | Neon PostgreSQL |
| Cache | Upstash Redis |
| Storage | Cloudflare R2 |
| Auth | Clerk |
| Payments | Stripe |
| AI | OpenRouter (12+ models) |

## Key Features

- **Infinite Canvas** — React Flow powered workspace with dot-grid background
- **12+ AI Models** — Claude, GPT-4o, Gemini, Sonar, Grok, Llama, and more
- **Shared Context** — Visual arrows connecting tiles for automatic context injection
- **Consensus Mode** — 3 models answer simultaneously with AI synthesis
- **Credit System** — Atomic Redis-based deduction with Stripe billing
- **Deep Research** — Multi-pass web research with citations

## License

MIT
