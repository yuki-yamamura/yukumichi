---
paths: "apps/api/src/presentation/**/*.ts"
---

# Presentation Layer Guidelines

## Mutation Responses

Mutation endpoints respond with an empty body. Create returns `201 Created`; updates, archives, deletes, and similar mutations return `204 No Content`. The frontend does not consume the body for any of these, so serializing the mutated resource adds wire weight without value.

## Error Code Contract

`ApiError.code` is the public contract that the frontend branches on for user-facing message rendering. `ApiError.message` is for developer debugging only — the frontend must not display it. Treat `code` as a stable enum and `message` as free-form text that may change without coordination.

Developer-written `message` strings (those constructed in `apps/api`, not forwarded from a lower layer) follow a small style rule for log readability:

- Sentence case (capitalize first letter, plain prose otherwise).
- No trailing period.
- Prefer noun phrases for the condition; append context after a colon when an identifier helps.
