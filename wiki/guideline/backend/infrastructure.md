---
paths: "apps/api/src/infrastructure/**/*.ts"
---

# Infrastructure Layer Guidelines

## Return Type and Exceptions

Every repository method returns `ResultAsync<T, E>` from neverthrow. Exceptions must not cross the layer boundary. When a third-party call (driver, SDK, HTTP client) throws, wrap it with `ResultAsync.fromPromise` and translate the rejection in the same call so the caller only ever sees Result values.

## Error Translation

Translate every error into a domain error type defined under `@/domain/error` before returning. Driver-level rejections become `DatabaseError`; failed reconstruction of a domain object from a row becomes `DataIntegrityError`; missing rows become `NotFoundError`. Callers compose against the domain error union and never see infrastructure-shaped errors.

## Mutation Return Values

Mutating methods return data the caller can use without an extra round-trip to the database. Two shapes are acceptable depending on what the caller needs next:

- **Identifier** (`ResultAsync<EntityId, ...>`): return when the caller already holds the input and only needs a stable reference for follow-up reads, response composition, or further mutations.
- **Full entity** (`ResultAsync<Entity, ...>`): return when the caller needs the canonical post-mutation state, including server-derived fields such as `updatedAt`.

Pick one shape per method and lock it into the repository interface.
