---
paths: "apps/api/src/domain/**/*.ts"
---

# Domain Layer Guidelines

The domain layer contains entities, value objects, and domain errors. It represents business rules independent of any framework or transport.

See `architecture.md` for the layer overview, dependency direction, and the validation decision table.

## Dependencies

Domain code may use pure utility libraries (Zod, neverthrow) but must not reference any other layer (`presentation`, `application`, `infrastructure`). This keeps the domain portable: it can be exercised by tests, scripts, or future alternative entry points without dragging in HTTP, database, or AWS code.

## Value Objects

Represent value objects as factory functions that return `Result<T, ValidationError>`. The factory enforces every invariant; once a value object exists, downstream code may assume it is valid without defensive checks.

Example:

```typescript
// apps/api/src/domain/spot/models/coordinate.ts
import { err, ok } from "neverthrow";
import z from "zod";

import type { ValidationError } from "@/domain/error";
import type { Result } from "neverthrow";

export const latitudeSchema = z.number().min(-90).max(90);
export const longitudeSchema = z.number().min(-180).max(180);

export type Coordinate = Readonly<{
  latitude: number;
  longitude: number;
}>;

export function Coordinate({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}): Result<Coordinate, ValidationError> {
  const latitudeResult = latitudeSchema.safeParse(latitude);
  if (!latitudeResult.success) {
    return err({ kind: "validation", message: latitudeResult.error.message });
  }

  const longitudeResult = longitudeSchema.safeParse(longitude);
  if (!longitudeResult.success) {
    return err({ kind: "validation", message: longitudeResult.error.message });
  }

  return ok({ latitude: latitudeResult.data, longitude: longitudeResult.data });
}
```

## Sharing Pure Artifacts

Domain modules may export pure literal constants and pure validation schemas for reuse by other layers (typically presentation). These exports are definitions, not behavior, and do not violate the domain's dependency isolation — the consumer depends on a shared definition, not on domain logic.

You may export:

- Literal constants (e.g., `COORDINATE_BOUNDS`).
- Zod schemas that represent the validation rule for a value (e.g., `latitudeSchema`).

You must not export in a way that invites external construction of domain objects bypassing the factory:

- Internal helper functions that manipulate domain state.
- Mutable singletons or factories that hold domain state across calls.
