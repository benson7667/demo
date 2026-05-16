# pnpm Monorepo — Vite + Node + Shared Packages

A minimal, production-ready monorepo using **pnpm workspaces** with:
- `apps/web` — Vite + React frontend
- `apps/api` — Node.js + Express backend
- `packages/types` — shared TypeScript types
- `packages/utils` — shared utility functions
- `packages/ui` — shared React components

## Folder structure

```
.
├── apps/
│   ├── web/                  # Vite React app  (port 3000)
│   └── api/                  # Express backend (port 4000)
├── packages/
│   ├── types/                # shared TS types — used by both web and api
│   ├── utils/                # shared helpers — used by both web and api
│   └── ui/                   # shared React components — used by web only
├── tsconfig.base.json        # base TS config extended by all apps/packages
├── pnpm-workspace.yaml       # tells pnpm which folders are workspaces
└── package.json              # root scripts
```

## How workspace linking works

`pnpm-workspace.yaml` registers `apps/*` and `packages/*` as workspaces.
Each package uses `"workspace:*"` as its version when depending on a sibling:

```json
// apps/web/package.json
{
  "dependencies": {
    "@repo/types": "workspace:*",   // → packages/types
    "@repo/utils": "workspace:*",   // → packages/utils
    "@repo/ui":    "workspace:*"    // → packages/ui
  }
}
```

pnpm symlinks these locally — no publishing needed.
Any change to `packages/types` is immediately visible in `apps/web` and `apps/api`.

## Dev proxy (no CORS headaches)

`apps/web/vite.config.ts` proxies `/api/*` to `localhost:4000`:

```ts
server: {
  proxy: {
    '/api': { target: 'http://localhost:4000', changeOrigin: true }
  }
}
```

So in your React code you just `fetch('/api/users')` — no hardcoded ports,
no CORS issues, works identically in dev.

## Getting started

```bash
# 1. Install everything from the root
pnpm install

# 2. Run both apps in parallel
pnpm dev
# or individually:
pnpm dev:web   # starts Vite on :3000
pnpm dev:api   # starts Express on :4000 (tsx watch for hot reload)
```

## Useful commands

| Command | What it does |
|---------|-------------|
| `pnpm dev` | Start web + api in parallel |
| `pnpm build` | Build all apps/packages |
| `pnpm typecheck` | Type-check the whole repo |
| `pnpm --filter @repo/web dev` | Start only the frontend |
| `pnpm --filter @repo/api dev` | Start only the backend |
| `pnpm --filter @repo/types` | Run commands in a specific package |

## Adding a new shared package

```bash
mkdir -p packages/config/src
# add package.json with name "@repo/config"
# then in any app:
pnpm --filter @repo/web add @repo/config@workspace:*
```

## Key design decisions

- **`"main": "./src/index.ts"`** in packages — since both apps consume packages
  through Vite (for web) or `tsx` (for api), we point directly at source rather
  than building the packages first. No extra build step needed in dev.
- **`workspace:*`** — pnpm-specific protocol that resolves to the local version.
  On publish/release, pnpm automatically rewrites this to the real version.
- **Separate tsconfigs** — `apps/api` uses `moduleResolution: NodeNext` while
  `apps/web` uses `bundler`. Both extend `tsconfig.base.json` for shared strictness.
