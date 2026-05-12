import type { Result } from "@/utils/result";

export function mustBeSuccess<T, E>(result: Result<T, E>): T {
  if (result.isErr) {
    throw result.error;
  }

  return result.value;
}

export function mustBeSuccessAll<T extends readonly Result<unknown, unknown>[]>(results: T) {
  return results.map((result) => mustBeSuccess(result)) as {
    [K in keyof T]: T[K] extends Result<infer U, unknown> ? U : never;
  };
}
