---
paths: "apps/api/src/**/*.ts"
---

# Environment Variables Guidelines

Environment variables for `apps/api` are centralized in `apps/api/src/env.ts`. Both entry points (`server.ts`, `lambda.ts`) import from there, and no other module reads `process.env` directly.
The env object is produced by parsing `process.env` through a Zod schema, so every consumer receives a fully typed value with its invariants (URL format, non-empty strings, etc.) already enforced.

## Secrets

`apps/api/.env` is ignored by Git and holds real values for local development. `apps/api/.env.example` is tracked and must contain only placeholder values — never commit real secrets.
