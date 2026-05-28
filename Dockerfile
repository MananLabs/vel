FROM node:20-alpine AS base
RUN corepack enable && corepack prepare npm@latest --activate
WORKDIR /app

COPY package.json package-lock.json .npmrc ./
COPY packages/shared/package.json packages/shared/
COPY backend/api/package.json backend/api/
RUN npm ci --legacy-peer-deps

FROM base AS build
COPY packages/shared/tsconfig.json packages/shared/
COPY packages/shared/src packages/shared/src
COPY backend/api/tsconfig.json backend/api/tsconfig.build.json backend/api/
COPY backend/api/src backend/api/src
RUN npm run build --workspace=@vel-ai/shared && npm run build --workspace=@vel-ai/api

FROM node:20-alpine AS production
RUN apk add --no-cache tini
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app

COPY --from=build /app/package.json /app/package-lock.json /app/.npmrc ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/backend/api/dist ./backend/api/dist
COPY --from=build /app/backend/api/package.json ./backend/api/
COPY --from=build /app/packages/shared ./packages/shared
RUN mkdir -p node_modules/@vel-ai && ln -sf /app/packages/shared node_modules/@vel-ai/shared

USER appuser
ENV NODE_ENV=production
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/v1/health || exit 1
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "backend/api/dist/main.js"]
