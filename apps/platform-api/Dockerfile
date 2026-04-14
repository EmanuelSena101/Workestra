FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
COPY apps/platform-api/package.json ./apps/platform-api/
COPY packages/shared-types/package.json ./packages/shared-types/
COPY packages/workflow-schema/package.json ./packages/workflow-schema/
RUN npm install --workspace=apps/platform-api

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/platform-api/node_modules ./apps/platform-api/node_modules
COPY . .
RUN npm run build -w apps/platform-api

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY --from=builder /app/apps/platform-api/dist ./dist
COPY --from=builder /app/apps/platform-api/node_modules ./node_modules
COPY --from=builder /app/apps/platform-api/package.json ./

USER nestjs
EXPOSE 4000
ENV PORT=4000
CMD ["node", "dist/main"]
