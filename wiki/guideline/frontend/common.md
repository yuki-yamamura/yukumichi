---
paths: "apps/web/src/**/*.{ts,tsx,css}"
---

# Frontend Common Guidelines

The frontend lives under `apps/web/`. This document captures the high-level stack and the directory rules that the rest of the frontend guidelines build on.

## Tech Stack

| Tech                            | Purpose                                                |
| ------------------------------- | ------------------------------------------------------ |
| Next.js (App Router)            | Framework, deployed to Cloudflare Workers via OpenNext |
| React + React Compiler          | UI runtime with automatic memoisation                  |
| TypeScript                      | Type safety                                            |
| CSS Modules + `@unocss/reset`   | Styling baseline                                       |
| Base UI (`@base-ui/react`)      | Headless UI primitives, wrapped under `components/ui/` |
| Class Variance Authority        | Component variant resolver                             |
| Hono RPC client (`hono/client`) | Typed API client against `apps/api/`                   |
| TanStack Form                   | Form state and validation binding                      |
| Zod                             | Schema definition for forms and wire contracts         |
| Lucide React, Phosphor Icons    | Icon libraries                                         |
| Vitest browser mode             | Unit and integration tests                             |
| Playwright                      | E2E                                                    |
| MSW (Node mode)                 | API mocking for E2E                                    |
| Storybook + Chromatic           | Visual regression                                      |

Versions live in `apps/web/package.json` and the workspace `pnpm-workspace.yaml` catalog. This table is intentionally version-free so it does not drift.

## Directory Structure

```
apps/web/src/
├── app/             # Next.js App Router routes, layouts, pages
├── components/      # Shared UI building blocks
│   ├── form/        # TanStack Form field wrappers
│   ├── icons/       # Custom icon components
│   └── ui/          # shadcn/ui primitives rewritten in CSS Modules
├── env/             # Environment variable parsers
├── features/        # Feature-scoped modules (see below)
├── lib/             # Third-party library setup and helpers
├── mock/            # MSW handlers and server, loaded only when MOCK_API_ENABLED is true
├── shared/          # Cross-feature modules (see "Inter-feature Isolation" below)
├── test/            # Test fixtures shared across features
└── utils/           # Domain-agnostic utilities; publishable as an external package at any time
```

## Features

A feature directory groups everything tied to a single product capability. The current vocabulary is:

```
features/{feature}/
├── actions/         # Server Actions
├── api/             # Hono RPC client wrappers
├── components/      # UI components scoped to this feature
├── form/            # Zod schemas and TanStack Form options
└── types/           # Feature-specific type definitions
```

## Inter-feature Isolation

Feature directories must not import from each other. When two features need to share a module — a type, an API wrapper, a component, etc. — promote it to `shared/`, a sibling of `features/`:

```
apps/web/src/
├── features/
│   ├── feature-a/
│   └── feature-b/
└── shared/
```
