---
paths: "apps/api/src/domain/**/*.ts"
---

# Domain Layer Guidelines

## Return Type

Every domain function returns `Result<T, E>` for synchronous operations or `ResultAsync<T, E>` for asynchronous ones, both from neverthrow. This applies to value object factories, domain services, and any other domain code. Failures are values, never thrown exceptions — callers compose them through neverthrow combinators rather than try/catch.

## Branded Types

Identifiers and other primitive-like values are defined as branded types via Zod's `.brand<"...">()`. The brand makes nominally identical primitives (e.g., `SpotId` vs. a raw `string`) incompatible at the type level, so a function expecting a `SpotId` cannot silently receive any string. This catches mix-ups at compile time that no runtime check could.

## Immutability

Domain object types are declared `Readonly<>` (or with `readonly` per field) and must never be mutated after construction. Code that wants a modified version must produce a new object.

## State Transitions

State changes are expressed as pure functions that take the current state and return a new value of the next state's type. In-place mutation, methods on the object, and direct field assignment are all forbidden.
