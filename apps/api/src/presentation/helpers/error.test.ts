import { toApiError, toHttpStatusCode } from "./error";

import type { ErrorKind } from "./error";
import type { ApiError, ErrorCode } from "@yukumichi/shared/error";
import type { ContentfulStatusCode } from "hono/utils/http-status";

describe("toApiError", () => {
  it.each<[{ kind: ErrorKind; message: string }, ApiError]>([
    [
      { kind: "VALIDATION", message: "Invalid input" },
      { code: "VALIDATION_ERROR", message: "Invalid input" },
    ],
    [
      { kind: "NOT_FOUND", message: "Resource not found" },
      { code: "NOT_FOUND_ERROR", message: "Resource not found" },
    ],
    [
      { kind: "SPOT_DUPLICATED", message: "Conflict occurred" },
      { code: "SPOT_DUPLICATED_ERROR", message: "Conflict occurred" },
    ],
    [
      { kind: "ACCOUNT_ALREADY_REGISTERED", message: "Already registered" },
      { code: "ACCOUNT_ALREADY_REGISTERED_ERROR", message: "Already registered" },
    ],
    [
      { kind: "AUTH_GATEWAY", message: "Cognito unavailable" },
      { code: "AUTH_GATEWAY_ERROR", message: "Cognito unavailable" },
    ],
    [
      { kind: "CODE_INVALID", message: "Wrong code" },
      { code: "CODE_INVALID_ERROR", message: "Wrong code" },
    ],
    [
      { kind: "DATA_INTEGRITY", message: "Data integrity issue" },
      { code: "DATA_INTEGRITY_ERROR", message: "Data integrity issue" },
    ],
    [
      { kind: "UNKNOWN", message: "An unknown error occurred" },
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
    ["BAD_REQUEST_ERROR", 400],
    ["CODE_INVALID_ERROR", 400],
    ["NOT_FOUND_ERROR", 404],
    ["ACCOUNT_ALREADY_REGISTERED_ERROR", 409],
    ["SPOT_DUPLICATED_ERROR", 409],
    ["AUTH_GATEWAY_ERROR", 502],
    ["DATABASE_ERROR", 500],
    ["DATA_INTEGRITY_ERROR", 500],
    ["UNKNOWN_ERROR", 500],
    ["VALIDATION_ERROR", 500],
  ])('can convert "%s" to a ContentfulStatusCode', (code, expected) => {
    // When
    const result = toHttpStatusCode(code);

    // Then
    expect(result).toBe(expected);
  });
});
