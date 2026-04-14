FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
COPY apps/platform-worker/package.json ./apps/platform-worker/
COPY packages/shared-types/package.json ./packages/shared-types/
COPY packages/workflow-schema/package.json ./packages/workflow-schema/
RUN npm install --workspace=apps/platform-worker

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/platform-worker/node_modules ./apps/platform-worker/node_modules
COPY . .
RUN npm run build -w apps/platform-worker

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 worker

COPY --from=builder /app/apps/platform-worker/dist ./dist
COPY --from=builder /app/apps/platform-worker/node_modules ./node_modules
COPY --from=builder /app/apps/platform-worker/package.json ./

USER worker
CMD ["node", "dist/main"]
