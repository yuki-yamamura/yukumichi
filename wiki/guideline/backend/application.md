---
paths: "apps/api/src/application/**/*.ts"
---

# Application Layer Guidelines

## Input / Output

A use case's input and output types must not depend on domain types. Inputs are primitives or plain DTOs handed in from the presentation layer; outputs are primitives, plain DTOs, or `void`. This keeps use cases composable and prevents changes to a domain shape from rippling out to HTTP handlers or other callers.

## Railway Oriented Programming

Use cases compose domain operations and repository calls following Railway Oriented Programming. Each step runs on the success rail; the first failure short-circuits the rest of the chain and emerges from the use case as its error value. Branching on `.isOk()` / `.isErr()` to extract values manually defeats the chain and is forbidden.

Reference: <https://fsharpforfunandprofit.com/rop/>

## Return Type and Exceptions

Every use case returns `Result<T, E>` for synchronous operations or `ResultAsync<T, E>` for asynchronous ones, both from neverthrow. Failures must be returned as values — throwing exceptions and catching them with `try` / `catch` are both forbidden. If a third-party call throws, wrap it at the infrastructure boundary so the use case only ever sees Result values.
