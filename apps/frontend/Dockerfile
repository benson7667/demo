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
    pnpm install --frozen-lockfile --filter=@repo/frontend...

FROM deps AS builder
COPY tsconfig.base.json ./
COPY apps/frontend ./apps/frontend
COPY packages/types ./packages/types
RUN pnpm --filter @repo/frontend build

FROM nginx:alpine AS runner
COPY --from=builder /repo/apps/frontend/dist /usr/share/nginx/html
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
