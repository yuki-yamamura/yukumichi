---
paths: "apps/api/src/**/*.test.ts, apps/api/src/test/**/*.ts, apps/api/vitest.config.ts"
---

# Backend Testing Guidelines

The API splits its test suite by size, following the small/medium taxonomy. Each size runs as its own Vitest project, with its own setup, parallelism, and infrastructure requirements.

## Test Sizes

| Size      | File suffix         | DB / Docker | Parallelism      | Example location                                |
| --------- | ------------------- | ----------- | ---------------- | ----------------------------------------------- |
| Unit      | `*.test.ts`         | None        | Default workers  | `src/domain/**`, `src/application/**`, mocked routes |
| Medium    | `*.medium.test.ts`  | Required    | Single worker    | `src/infrastructure/repositories/**`, route tests that hit Postgres |

A test is **medium** when it depends on the testcontainers Postgres instance. In practice this means it imports `@/test/database/helpers` or calls `inject("databaseUrl")`. Every such file must end in `.medium.test.ts`. Everything else is **unit**.

## Vitest Projects

`apps/api/vitest.config.ts` declares both sizes via `test.projects`:

- `unit` — includes `src/**/*.test.ts`, excludes `*.medium.test.ts`. No `globalSetup`, no Docker dependency.
- `medium` — includes `src/**/*.medium.test.ts` only. Loads `src/test/vitest.setup.medium.ts` as `globalSetup`, runs with `maxWorkers: 1` and `hookTimeout: 30_000`.

The medium-only `globalSetup` lives at `apps/api/src/test/vitest.setup.medium.ts`. The path encodes both its hook type (`vitest.setup`) and its scope (`.medium`), to mirror the test-file naming.

## Running Tests

| Command                                       | What runs                                   |
| --------------------------------------------- | ------------------------------------------- |
| `pnpm --filter @sanpo/api test`               | Both projects (CI uses this).               |
| `pnpm --filter @sanpo/api test:unit`          | Unit only. No Docker required.              |
| `pnpm --filter @sanpo/api test:medium`        | Medium only. Boots the Postgres container.  |
| `pnpm --filter @sanpo/api test:watch`         | Vitest watch mode across both projects.     |

When iterating on pure domain or application logic, prefer `test:unit` — it skips the 5–15s container boot.
