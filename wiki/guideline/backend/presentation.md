---
paths: "apps/api/src/presentation/**/*.ts"
---

# Presentation Layer Guidelines

The presentation layer is the HTTP boundary. It translates wire-format payloads into calls to the application layer and translates application results back into HTTP responses.

See `architecture.md` for the layer overview, dependency direction, and the validation decision table.

## Request and Response Schemas

Define Zod schemas under `apps/api/src/presentation/schemas/` and apply them via `@hono/zod-validator` on Hono routes.

Schemas must:

- Validate wire format (types, shapes, required fields).
- Include range, length, and format constraints that belong to the definition of the value. When such a constraint is also enforced by the domain, import the shared schema or constant from the domain module rather than inlining the literal — the domain owns the definition.
- Produce HTTP 400 with a field-level error path before any use case runs.

Example:

```typescript
// apps/api/src/presentation/schemas/spot.ts
import z from "zod";

import { latitudeSchema, longitudeSchema } from "@/domain/spot/models/coordinate";

export const createSpotRequestBodySchema = z.object({
  name: z.string().min(1).max(100),
  latitude: latitudeSchema,
  longitude: longitudeSchema,
});
```

## Error Translation

Domain errors must not leak into HTTP responses. The application layer converts domain results into either a success DTO or an `ApplicationError`. Presentation then maps `ApplicationError` to an HTTP status via `toHttpStatus` in `apps/api/src/presentation/schemas/error.ts`.

You must not:

- Return a domain error type (e.g., `ValidationError` from `@/domain/error`) directly from a route handler.
- Construct HTTP status codes inside the domain or application layer.

You must:

- Translate application errors to `ApiError` via `toApiError`.
- Keep `toHttpStatus` cases ordered by ascending HTTP status for readability.
