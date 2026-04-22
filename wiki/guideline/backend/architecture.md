---
paths: "apps/api/src/**/*.ts"
---

# Backend Architecture Guidelines

## Layers

The API is organized into four layers:

| Layer            | Responsibility                                                                              |
| ---------------- | ------------------------------------------------------------------------------------------- |
| `presentation`   | HTTP boundary: Zod request/response schemas, Hono routes, error translation to HTTP status. |
| `application`    | Use cases that orchestrate domain objects and infrastructure adapters.                      |
| `domain`         | Entities, value objects, and domain errors. Pure business logic with no framework coupling. |
| `infrastructure` | Adapters for external systems (database, AWS SDK, third-party APIs).                        |

See the layer-specific guidelines for detailed conventions:

- `wiki/guideline/backend/presentation.md`
- `wiki/guideline/backend/domain.md`

## Dependency Direction

You must follow these dependency rules:

- `presentation` depends on `application`. It never takes domain entities, value objects, or domain errors as input or output of a use case. Use cases must accept and return plain data shapes (primitives, DTOs, `ApplicationError`), so that the HTTP layer has nothing domain-specific crossing its boundary.
- `application` depends on `domain` and `infrastructure` (the only layer that may compose the two).
- `domain` depends on nothing inside `apps/api`. It may use pure utility libraries (Zod, neverthrow), but must not reference `presentation`, `application`, or `infrastructure` modules.
- `infrastructure` depends on `domain` (to reconstruct aggregates), but not on `application` or `presentation`.

### Importing Pure Artifacts Across Layers

You may import **pure literal values and pure validation schemas** across layer boundaries when they represent shared definitions. This is not a dependency on behavior — it is a reference to a definition.

Examples of acceptable cross-layer imports:

- A `const LATITUDE_BOUNDS = { min: -90, max: 90 }` defined in `domain` and imported by `presentation` to build a Zod schema.
- A `latitudeSchema = z.number().min(-90).max(90)` exported from `domain` and reused by a presentation schema.

You must not import the following across layer boundaries, even when they look pure:

- Entity or value object factory functions (e.g., `Coordinate(...)` that returns `Result<Coordinate, ValidationError>`).
- Domain error types (e.g., `ValidationError`, `NotFoundError`).
- Use case functions or their return types.

## Validation Principle

Validation appears in two places for different reasons:

- **Presentation validation** guards the wire format at the HTTP boundary. It rejects malformed payloads before any domain logic runs and produces HTTP 400 with a field-level error path. See `presentation.md` for implementation.
- **Domain validation** enforces value-object invariants regardless of how the object is constructed — HTTP handler, database hydration, batch job, or test fixture. See `domain.md` for implementation.

Both must coexist when a constraint belongs to the definition of a value. Use this decision table when deciding where a constraint belongs:

| Constraint kind                                    | Presentation | Domain | Example                                    |
| -------------------------------------------------- | ------------ | ------ | ------------------------------------------ |
| Part of the definition of the value (an invariant) | ✓            | ✓      | Latitude range, non-empty spot name        |
| Wire format only (type, shape, required fields)    | ✓            | —      | Field must be a `number`, not a `string`   |
| UX-only (display hint, form affordance)            | —            | —      | Textarea shows a 100-char hint in the form |

When a constraint belongs to both layers, extract a single source of truth in `domain` and import it into `presentation`. Domain owns the definition; presentation references it to produce early HTTP 400 responses. The two layers run the same check at different times for different reasons — this is intentional duplication of execution, not of definition.
