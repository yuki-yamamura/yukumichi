---
paths: "apps/api/src/presentation/**/*.ts"
---

# Presentation Layer Guidelines

The presentation layer is the HTTP boundary. It translates wire-format payloads into calls to the application layer and translates application results back into HTTP responses.

See `architecture.md` for the layer overview, dependency direction, and the validation decision table.

## Request and Response Schemas

Define Zod schemas under `apps/api/src/presentation/schemas/` and apply them via the project's `zValidator` wrapper at `@/presentation/middlewares/zod-validator`. The wrapper translates Zod validation failures into the project's `ApiError` shape with the correct HTTP status; do not import `@hono/zod-validator` directly outside the wrapper itself.

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

## Error Messages

Developer-written error `message` strings — those constructed anywhere in `apps/api` and passed through the `{ kind, message }` shape used by domain, application, and `ApiError` results — must follow these rules:

- **Sentence case**: capitalize the first letter; leave the rest as ordinary prose.
- **No trailing period**: messages are fragments, not sentences.
- **Noun phrases for generic errors**: prefer a noun phrase that names the condition. Append context after a colon when an identifier or detail is helpful.
- **Predicate form only for state or rule violations**: use a subject-verb form when the message describes that an entity is in a state that blocks the requested action.

This applies only to messages authored in this repository. Messages forwarded from a lower layer (`error.message` from a domain or library result) keep whatever form their source produced.

Positive examples:

```typescript
// Generic error — noun phrase
return err({ kind: "not_found", message: `Spot not found: ${id}` });
return err({ kind: "data_integrity", message: `Archived spot not found: ${id}` });
return c.json({ code: "UNKNOWN_ERROR", message: "Internal server error" }, 500);

// State or rule violation — predicate form
return err({ kind: "conflict", message: `Spot is already archived: ${spotId}` });
```

Negative examples:

```typescript
// Lowercase first letter
return err({ kind: "not_found", message: `spot not found: ${id}` });

// Trailing period
return err({ kind: "not_found", message: `Spot not found: ${id}.` });

// Predicate form used for a generic not-found
return err({ kind: "not_found", message: `Spot does not exist: ${id}` });
```

Rationale:

- Backend `message` values are not rendered in the frontend; they are read by developers in CloudWatch structured logs, where Sentence case is easier to scan.
- Go's lowercase convention exists because errors are wrapped by string concatenation (`fmt.Errorf("foo: %w", err)`). This codebase uses discriminated `Result<T, DomainError>` via neverthrow with no string concatenation — the rationale does not transfer.
- Zod-originated messages are already Sentence case; aligning developer-written messages removes the internal/external inconsistency.
- `"Internal server error"` matches the HTTP 500 reason phrase exactly, aiding log recognition.

## Route Testing

Routes are exercised in two layers, split by responsibility.

### Small Tests (`routes/*.test.ts`)

Construct the route with use cases mocked via `vi.fn()`, then assert one HTTP status code per test.

- Mock every use case the route depends on. The handler must never reach a real use case implementation in this layer.
- Mount the route under its production prefix when constructing the test client, so the client shape matches the production RPC type:

  ```ts
  const client = testClient(new Hono().route("/spots", spotRoute));
  ```

  Without the wrapper, `testClient(spotRoute)` exposes `client.index.*` because the route file declares relative paths and the prefix lives in `app.ts`.

- Write one test per HTTP status code the route documents in `describeRoute`. Each test triggers exactly one status; do not bundle multiple statuses into a single case. This keeps the small-test set in lockstep with the OpenAPI response declarations.

### Medium Tests (`routes/*.medium.test.ts`)

Boot the full app via `createApp` against the testcontainers PostgreSQL provided by `globalSetup`, and exercise only the happy path of each endpoint.

- Real database, real repositories, real use cases — only the connection URL is supplied externally via `inject("databaseUrl")`.
- One happy-path test per endpoint. Validation failures, not-found, conflict, and internal errors are intentionally covered by small tests instead; medium tests must not duplicate them.
- Truncate tables in `beforeEach` and close the connection in `afterAll`.
- Each medium test asserts both the HTTP response and a database postcondition (rows present, archived, etc.) so the integration boundary is validated end-to-end.
