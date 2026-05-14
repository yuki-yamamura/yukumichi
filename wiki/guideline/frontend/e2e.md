---
paths: "apps/e2e/**/*.ts"
---

# E2E Testing Guidelines

Playwright drives browser-level tests. They split into two purposes:

| Type     | Directory                      | Backend                                                             | Coverage                                                                          |
| -------- | ------------------------------ | ------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Feature  | `usecase/test-cases/*.spec.ts` | Mocked via [`@msw/playwright`](https://github.com/mswjs/playwright) | A single user-valuable feature that covers what Vitest cannot exercise.           |
| Scenario | `usecase/scenarios/*.spec.ts`  | Real (Hono dev server + PostgreSQL)                                 | Multi-feature user stories that traverse several features as one continuous flow. |

## When to Write

### Feature test (`test-cases/`)

Write one per user-valuable feature where the flow crosses pages, persistence, or navigation that Vitest cannot exercise in isolation.

### Scenario test (`scenarios/`)

Write one per coherent user story that exercises multiple features back-to-back against the real backend. Use scenarios to verify the system end-to-end, including server-side contracts that mocks cannot represent.
