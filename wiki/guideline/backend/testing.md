---
paths: "apps/api/src/**/*.test.ts"
---

# Backend Testing Guidelines

Tests come in two sizes following Google's test size taxonomy: **Small** (in-process, mocked dependencies, no I/O) and **Medium** (localhost-only, real PostgreSQL via testcontainers, real adapters). Each architectural layer below specifies which sizes apply and what they must cover.

Reference: <https://testing.googleblog.com/2010/12/test-sizes.html>

## Presentation

### Medium (`routes/*.medium.test.ts`)

One happy-path test per endpoint. Boot the full app via `createApp` against the testcontainers PostgreSQL provided by `globalSetup`. Each test asserts both the HTTP response and a database postcondition (rows present, archived, etc.).

### Small (`routes/*.test.ts`)

Cover every HTTP status declared in the route's `describeRoute`. Mock every use case so the handler never reaches a real implementation. For 4xx validation responses, exercise at least one failing case per validated request-body or param field, so that a regression in the schema for any single field surfaces as a test failure.

## Use Case (`application/usecase/**/*.test.ts`)

Small tests only — presentation medium tests cover end-to-end paths.

Every error `kind` in `execute`'s return-type union must be asserted by at least one test, including kinds that pass through unchanged from domain or repository.

## Domain (`domain/**/*.test.ts`)

One test per behavioral condition of each pure function. Cover the success path, every documented invariant violation, and any boundary value (inclusive vs. exclusive bounds).

## Repository (`infrastructure/repositories/**/*.test.ts`)

Medium tests only — repositories make no sense isolated from the database. Cover each public method's happy path, asserting the return value and, for mutating methods, the resulting database row state. Error paths are covered by the owning higher layer (use case small tests, route small tests).
