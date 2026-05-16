---
paths: "apps/web/src/**/*.test.{ts,tsx}"
---

# API Guidelines

Functions under `features/{feature}/api/` make type-safe calls to the API defined in `apps/api/`.
They wrap the Hono RPC client and adapt its response into a `Result` type so callers can branch on success or failure without try/catch.

## Why Using Result type

Next.js [recommends modelling expected errors as Server Action return values](https://nextjs.org/docs/app/getting-started/error-handling) rather than throwing them.
An error thrown from a Server Action has its `message` redacted to a `digest` in production and is routed to `error.tsx`, so a `throw` cannot carry an actionable message or `code` back to the form.
Returning `Result<T, ApiError>` keeps the failure as typed data that the Server Action reads to compose a user-facing response, leaving `throw` reserved for genuine bugs.

## File Rules

One function per file under `features/{feature}/api/`.

```
features/{feature}/api/
├── create-resource.ts        # exports createResource
├── delete-resource.ts        # exports deleteResource
├── get-resource.ts           # exports getResource
├── list-resources.ts         # exports listResources
└── update-resource.ts        # exports updateResource
```

## Naming

| HTTP method | Semantics                          | Pattern                                |
| ----------- | ---------------------------------- | -------------------------------------- |
| GET         | Read a single resource             | `get{Resource}`                        |
| GET         | Read a collection                  | `list{Resources}`                      |
| POST        | Create a resource                  | `create{Resource}`                     |
| POST        | Domain action with a distinct verb | the domain verb like `archiveResource` |
| PATCH / PUT | Update a resource                  | `update{Resource}`                     |
| DELETE      | Delete a resource                  | `delete{Resource}`                     |

## Type Definitions

API request and response types live in `features/{feature}/types/api.ts` and are derived from the Hono RPC client via `InferRequestType` / `InferResponseType`. Do not hand-write interfaces that mirror the API.

| Kind             | Pattern                        |
| ---------------- | ------------------------------ |
| Request          | `{Verb}{Resource}Request`      |
| Response payload | `{Verb}{Resource}ResponseData` |

## Argument

API functions accept the Hono RPC request shape as a single argument. The caller writes `{ json, param, query }` as Hono defines them.

```ts
import { fetchClient } from "@/lib/hono/client";
import { toResult } from "@/lib/hono/converter";

import type { CreateResourceRequest } from "@/features/{feature}/types/api";
import type { Result } from "@/utils/result";
import type { ApiError } from "@yukumichi/shared/error";

export function createResource(request: CreateResourceRequest): Promise<Result<null, ApiError>> {
  return toResult(fetchClient.resources.$post(request));
}
```

## Return Type

Annotate the return type explicitly as `Promise<Result<T, ApiError>>`, where `T` is the success body type from the API definition:

- `null` for 201 or 204 responses. `toResult` normalises Hono's `undefined` to `null` so the runtime value matches the annotation.
- The inferred response payload type 200 responses with a JSON body.
