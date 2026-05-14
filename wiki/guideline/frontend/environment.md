---
paths: "apps/web/src/**/*.{ts,tsx}"
---

# Environment Variables Guidelines

Environment variables for `apps/web` are centralized under `apps/web/src/env/`. Each file exports a parsed env object, and no other module reads `process.env` directly.
The env object is produced by parsing `process.env` through a Zod schema, so every consumer receives a fully typed value with its invariants (URL format, non-empty strings, etc.) already enforced.

Client-exposed variables must be prefixed with `NEXT_PUBLIC_` per Next.js convention and live in `client.ts`. Server-only variables, when introduced, belong in a sibling file (e.g. `server.ts`) and must never be imported from client components.

## Secrets

`apps/web/.env` is ignored by Git and holds real values for local development. `apps/web/.env.example` is tracked and must contain only placeholder values — never commit real secrets.
