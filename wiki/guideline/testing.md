---
paths: "**/*.test.{ts,tsx}"
---

# Testing Guidelines

## Accurate Tests

A test must verify the system's contract — the behavior it offers callers — not the implementation that happens to fulfill that contract today. Internals change without the contract changing; tests bound to internals decay.

- Cover both preconditions and postconditions. Confirm setup state before the action so the test is not silently dependent on shared state, and assert observable outcomes after (return value, persisted state, emitted events, etc.). A test that skips either side is incomplete.
- Do not assert against implementation details: the order of internal calls, helper invocations, intermediate data structures, or values the system computes but does not promise.
- Use `toEqual` (or your runner's equivalent strict-equality matcher) to verify object shapes. Avoid `toMatchObject` — it silently accepts extra unrelated fields and weakens the check.

## Test Fixtures

Provide a factory function for every domain object. Tests never construct domain objects inline; they always go through the paired factory.

Fixture functions provide arbitrary-but-valid sample data. Tests pass overrides for the fields they care about and assert only on those overrides or on values the system under test is contractually obligated to produce.

A test must not fail when a fixture's internal data generator changes (e.g., faker version bump). When such a change does break a test, the test was asserting incidental fixture state instead of the system under test's behavior.

## Given / When / Then

Each test is structured in three sections, in this order:

- **Given**: declare all inputs, configure every mock or stub, and verify any precondition the test depends on. All preparation, including assertions on setup state, completes here.
- **When**: invoke the system under test exactly once.
- **Then**: assert the return value, side effects, and any postcondition.
