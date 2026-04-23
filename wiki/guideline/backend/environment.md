---
paths: "apps/api/src/env.ts"
---

# Environment Variables Guidelines

Environment variables for `apps/api` are centralized in `apps/api/src/env.ts`. Both entry points (`server.ts`, `lambda.ts`) import from there, and no other module reads `process.env` directly.

The env object is produced by parsing `process.env` through a Zod schema, so every consumer receives a fully typed value with its invariants (URL format, non-empty strings, etc.) already enforced.

## Access

Import `env` from `@/env` and read values as typed properties. Do not reference `process.env.X` anywhere outside `env.ts`.

```typescript
// Good
import { env } from "@/env";

// Bad
process.env.DATABASE_URL;
```

When a new variable is needed, add its field to `envSchema` with a Zod type that expresses the invariant, and add a matching entry to `apps/api/.env.example`.

## Secrets

`apps/api/.env` is gitignored and holds real values for local development. `apps/api/.env.example` is tracked and must contain only placeholder values — never commit real secrets.
