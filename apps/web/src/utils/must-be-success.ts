import type { Result } from "@/utils/result";

export function mustBeSuccess<T, E>(result: Result<T, E>): T {
  if (result.isErr) {
    // NOTE: The error is the caller-defined failure value (e.g. ApiError), not an Error instance. Wrapping would discard structure such as `code`.
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw result.error;
  }

  return result.value;
}

export function mustBeSuccessAll<T extends readonly Result<unknown, unknown>[]>(results: T) {
  // NOTE: TypeScript cannot express that `results.map(mustBeSuccess)` produces a mapped tuple type from `T`. The assertion narrows the runtime `unknown[]` to the per-element value type.
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return results.map((result) => mustBeSuccess(result)) as {
    [K in keyof T]: T[K] extends Result<infer U, unknown> ? U : never;
  };
}
