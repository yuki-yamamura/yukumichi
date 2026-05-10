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

## Validation Principle

Validation lives in two layers for different reasons:

- **Presentation** validates what the caller (frontend) already knows — wire format, form-level constraints, and any domain value the frontend itself handles (e.g., enums shared between client and server). Reject obviously bad input at the boundary before the application layer runs.
- **Domain** defines every type used in business logic. All layers from `application` downward must return only domain errors; `presentation` is the only layer that translates them to HTTP responses.

When a constraint belongs to both, extract a single source of truth in `domain` and reference it from `presentation`.
