# ═══════════════════════════════════════════════════════════
# VEL AI — API Dockerfile (Railway)
# ═══════════════════════════════════════════════════════════

FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY packages/ ./packages/
RUN npm ci --workspace=apps/api --workspace=packages/shared
COPY apps/api ./apps/api
COPY packages ./packages
RUN npm run build --workspace=apps/api

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=10s \
  CMD wget -qO- http://localhost:3001/api/v1/health || exit 1
CMD ["node", "dist/main.js"]
