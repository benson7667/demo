# syntax=docker/dockerfile:1.7
# Build context: monorepo root
FROM node:24-alpine AS base
RUN corepack enable && corepack prepare pnpm@11.1.2 --activate
WORKDIR /repo

FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/api/package.json apps/api/
COPY apps/frontend/package.json apps/frontend/
COPY packages/types/package.json packages/types/
COPY packages/utils/package.json packages/utils/
COPY packages/ui/package.json packages/ui/
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --filter=@repo/api...

FROM base AS runner
ENV NODE_ENV=production
ENV PORT=4000
COPY --from=deps /repo/node_modules ./node_modules
COPY --from=deps /repo/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /repo/packages/types/node_modules ./packages/types/node_modules
COPY --from=deps /repo/packages/utils/node_modules ./packages/utils/node_modules
COPY pnpm-workspace.yaml package.json ./
COPY apps/api ./apps/api
COPY packages/types ./packages/types
COPY packages/utils ./packages/utils
WORKDIR /repo/apps/api
EXPOSE 4000
CMD ["node_modules/.bin/tsx", "src/index.ts"]
