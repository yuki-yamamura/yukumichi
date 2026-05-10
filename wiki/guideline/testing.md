---
paths: "**/*.test.{ts,tsx}"
---

# Testing Guidelines

## Accurate Assertions

Write the most specific assertion that captures the rule under test, but do not assert against values that are implementation details. The shape of a test should change only when the contract changes, never when arbitrary internals do.

- Prefer property access over `toMatchObject` when verifying a single field. `expect(error.kind).toBe("not_found")` is sharper than `expect(error).toMatchObject({ kind: "not_found" })` — `toMatchObject` silently accepts extra unrelated fields and weakens the check.
- Do not assert against fixture-generated random values (faker output, timestamps produced inside the system under test, etc.).

## Test Fixtures

Fixture functions provide arbitrary-but-valid sample data. Tests pass overrides for the fields they care about and assert only on those overrides or on values the system under test is contractually obligated to produce.

A test must not fail when a fixture's internal data generator changes (e.g., faker version bump). When such a change does break a test, the test was asserting incidental fixture state instead of the system under test's behavior.

## Given / When / Then

Each test is structured in three sections, in this order:

- **Given**: declare all inputs, configure every mock or stub, and verify any precondition the test depends on. All preparation, including assertions on setup state, completes here.
- **When**: invoke the system under test exactly once.
- **Then**: assert the return value, side effects, and any postcondition.

Anything that verifies *setup* rather than *result* belongs in Given. Example: a test that inserts a row and then asserts it is the only row present must verify "the table is empty" inside Given (before the insert), not after When alongside the post-insert assertion.
