import { toApiError, toHttpStatusCode } from "./error";

import type { ApiError, ErrorCode, ErrorKind } from "@/presentation/types/error";
import type { ContentfulStatusCode } from "hono/utils/http-status";

describe("toApiError", () => {
  it.each<[{ kind: ErrorKind; message: string }, ApiError]>([
    [
      { kind: "validation", message: "Invalid input" },
      { code: "VALIDATION_ERROR", message: "Invalid input" },
    ],
    [
      { kind: "not_found", message: "Resource not found" },
      { code: "NOT_FOUND_ERROR", message: "Resource not found" },
    ],
    [
      { kind: "conflict", message: "Conflict occurred" },
      { code: "CONFLICT_ERROR", message: "Conflict occurred" },
    ],
    [
      { kind: "data_integrity", message: "Data integrity issue" },
      { code: "DATA_INTEGRITY_ERROR", message: "Data integrity issue" },
    ],
    [
      { kind: "unknown", message: "An unknown error occurred" },
      { code: "UNKNOWN_ERROR", message: "An unknown error occurred" },
    ],
  ])('can convert "%s" to an ApiError', (error, expected) => {
    // When
    const result = toApiError(error);

    // Then
    expect(result).toEqual(expected);
  });
});

describe("toHttpStatus", () => {
  it.each<[ErrorCode, ContentfulStatusCode]>([
    ["VALIDATION_ERROR", 400],
    ["NOT_FOUND_ERROR", 404],
    ["CONFLICT_ERROR", 409],
    ["DATA_INTEGRITY_ERROR", 500],
    ["UNKNOWN_ERROR", 500],
  ])('can convert "%s" to a ContentfulStatusCode', (code, expected) => {
    // When
    const result = toHttpStatusCode(code);

    // Then
    expect(result).toBe(expected);
  });
});
