FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
COPY apps/portal-web/package.json ./apps/portal-web/
COPY packages/ui-tokens/package.json ./packages/ui-tokens/
COPY packages/shared-types/package.json ./packages/shared-types/
COPY packages/workflow-schema/package.json ./packages/workflow-schema/
RUN npm install --workspace=apps/portal-web

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/portal-web/node_modules ./apps/portal-web/node_modules
COPY . .
RUN npm run build -w apps/portal-web

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/portal-web/public ./apps/portal-web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/portal-web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/portal-web/.next/static ./apps/portal-web/.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "apps/portal-web/server.js"]
