# CLAUDE.md

You must acknowledge these information and use it like a map that tell you how to walk with this project.

## Project Structure

```
.
├── apps/
│   ├── web/                       # Next.js web application
│   │   ├── src/
│   │   │   ├── app/               # App Router pages and layouts
│   │   │   ├── components/        # Shared UI components
│   │   │   │   ├── form/          # Form field wrappers (TanStack Form bindings)
│   │   │   │   ├── icons/         # Icon components
│   │   │   │   └── ui/            # Primitive UI components (buttons, inputs, etc.)
│   │   │   ├── env/               # Environment variable parsing
│   │   │   ├── features/          # Feature-specific modules (actions, api, components, form, types)
│   │   │   ├── lib/               # Third-party library wrappers and configurations
│   │   │   ├── mock/              # MSW handlers and server
│   │   │   └── test/              # Test helpers and fixtures
│   ├── api/                       # Hono API server (deployed to AWS Lambda)
│   │   ├── src/
│   │   │   ├── domain/            # DDD Domain Layer: entities, value objects, repository interfaces
│   │   │   ├── application/       # DDD Application Layer: use cases (one file per operation)
│   │   │   │   └── usecase/
│   │   │   ├── presentation/      # Interface Layer: HTTP concerns
│   │   │   │   ├── routes/        # Hono route handlers
│   │   │   │   ├── schemas/       # Zod request/response schemas
│   │   │   │   ├── middlewares/   # Hono middlewares
│   │   │   │   └── helpers/       # Handler helpers (error mapping, id parsing)
│   │   │   ├── infrastructure/    # DDD Infrastructure Layer: external service implementations
│   │   │   │   ├── database/      # Drizzle client and schema
│   │   │   │   └── repositories/  # Repository implementations
│   │   │   └── test/              # Test helpers (testcontainers, fixtures)
│   │   └── drizzle/               # Drizzle migrations
│   └── e2e/                       # Playwright end-to-end tests
│       ├── pages/                 # Page Object Models
│       ├── usecase/
│       │   ├── scenarios/         # User scenario tests
│       │   └── test-cases/        # Function-based test cases
│       └── fixtures/              # Playwright fixtures
│
├── packages/
│   ├── eslint-config/             # Shared ESLint / Prettier / Vitest configs
│   └── shared/                    # Cross-app wire contracts (Zod schemas, error codes)
│
├── infrastructure/                # Terraform IaC for AWS
│   ├── environments/
│   │   └── production/            # Production environment configuration
│   └── modules/
│       └── aws/                   # Reusable AWS modules
│
└── wiki/                          # Project documentation
│   ├── domain/                    # Domain knowledge base
│   │   └── workflows/             # Domain workflows (drawio diagrams)
│   ├── guideline/                 # Development guidelines
    └── user-manual/               # Operational manuals for humans — LLMs do not need to read this
```

## Development Commands

### Web (`apps/web/`)

| Command                | Description                                          |
| ---------------------- | ---------------------------------------------------- |
| `pnpm run dev`         | Start development server (Next.js)                   |
| `pnpm run codegen`     | Run all codegen (CSS Modules + Next.js route types)  |
| `pnpm run check-types` | Run TypeScript type checking (tsc)                   |
| `pnpm run lint:fix`    | Fix linting issues (ESLint, Stylelint)               |
| `pnpm run format:fix`  | Format code (Prettier)                               |
| `pnpm run test`        | Run unit tests (Vitest, browser mode via Playwright) |
| `pnpm run storybook`   | Start Storybook dev server                           |

### API (`apps/api/`)

| Command                | Description                                                   |
| ---------------------- | ------------------------------------------------------------- |
| `pnpm run dev`         | Start development server (tsx watch)                          |
| `pnpm run db:generate` | Generate migration files from schema (drizzle-kit)            |
| `pnpm run db:migrate`  | Apply all pending migrations (drizzle-kit)                    |
| `pnpm run check-types` | Run TypeScript type checking (tsc)                            |
| `pnpm run lint:fix`    | Fix linting issues (ESLint)                                   |
| `pnpm run format:fix`  | Format code (Prettier)                                        |
| `pnpm run test:small`  | Run small (unit) tests (Vitest)                               |
| `pnpm run test:medium` | Run medium (integration) tests against testcontainer Postgres |

### E2E (`apps/e2e/`)

| Command                | Description                        |
| ---------------------- | ---------------------------------- |
| `pnpm run test`        | Run end-to-end tests (Playwright)  |
| `pnpm run check-types` | Run TypeScript type checking (tsc) |
| `pnpm run lint:fix`    | Fix linting issues (ESLint)        |
| `pnpm run format:fix`  | Format code (Prettier)             |

### Shared (`packages/shared/`)

| Command                | Description                        |
| ---------------------- | ---------------------------------- |
| `pnpm run check-types` | Run TypeScript type checking (tsc) |
| `pnpm run lint:fix`    | Fix linting issues (ESLint)        |
| `pnpm run format:fix`  | Format code (Prettier)             |

## Design Overview

### Web

| Category   | Technology                                                       |
| ---------- | ---------------------------------------------------------------- |
| Framework  | Next.js (App Router)                                             |
| Deployment | Cloudflare Workers (via OpenNext)                                |
| UI         | Base UI (wrapped in `components/ui/`), CSS Modules               |
| Libraries  | Hono RPC client, TanStack Form, Zod, CVA, lucide-react, Phosphor |
| Testing    | Vitest (browser mode + Playwright), Testing Library, Faker       |
| Stories    | Storybook                                                        |

**Core React patterns:**

- Prefer Server Components; use Client Components only when necessary
- Container/Presenter: Container (server) fetches data, Presenter (client) handles UI
- Collocation: component, styles, tests, and stories in the same directory

### API

| Category  | Technology                                                 |
| --------- | ---------------------------------------------------------- |
| Language  | TypeScript                                                 |
| Runtime   | Node.js (dev), AWS Lambda (production, esbuild bundle)     |
| Framework | Hono with `hono-openapi`                                   |
| Database  | PostgreSQL (Drizzle ORM)                                   |
| Errors    | `neverthrow` (Result type) for domain/application failures |

**Core API Architecture:**

- Tactical DDD (Tactical Domain-Driven Design)
- [Railway Oriented Programming](https://fsharpforfunandprofit.com/rop/)
- RESTful API with OpenAPI generated from Zod schemas

### E2E

| Category  | Technology                                     |
| --------- | ---------------------------------------------- |
| Runner    | Playwright                                     |
| Structure | Page Object Models composed by tests           |
| Targets   | Web app driven through real browser (Chromium) |

**Core E2E patterns:**

- Page Object Model: per-page selectors and actions live in `pages/`
- `usecase/scenarios/` and `usecase/test-cases/` are independent siblings; both compose page objects, neither depends on the other
- `usecase/scenarios/` holds user scenario tests (multi-step flows)
- `usecase/test-cases/` holds feature tests (single feature units)

### Infrastructure

| Category | Technology                                 |
| -------- | ------------------------------------------ |
| IaC      | Terraform (linted with tflint)             |
| Cloud    | AWS (Lambda, RDS, ECR, VPC, SSM, CI roles) |
| State    | S3 (remote state per environment)          |
| Tooling  | mise (tool versions), lefthook (git hooks) |

## Next.js

<!-- BEGIN:nextjs-agent-rules -->

Before any Next.js work, find and read the relevant doc in `apps/web/node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.

<!-- END:nextjs-agent-rules -->
