import type { ApiError, ErrorCode } from "@sanpo/shared/error";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export const errorCodeMap = {
  conflict: "CONFLICT_ERROR", // Conflict error, such as when trying to create a resource that already exists
  data_integrity: "DATA_INTEGRITY_ERROR", // Data integrity error, such as when reconstructing a domain object from corrupted DB data
  database: "DATABASE_ERROR", // Database error, such as when a database operation fails
  not_found: "NOT_FOUND_ERROR", // Not found error, such as when a requested resource does not exist
  unknown: "UNKNOWN_ERROR", // Unknown error, such as unhandled exceptions or errors without a specific kind
  validation: "VALIDATION_ERROR", // Validation error, such as invalid input or missing required fields on domain logic level
} as const satisfies Record<string, ErrorCode>;

export type ErrorKind = keyof typeof errorCodeMap;

export function toApiError(error: { kind: ErrorKind; message: string }): ApiError {
  return {
    code: errorCodeMap[error.kind],
    message: error.message,
  };
}

export function toHttpStatusCode(code: ErrorCode): ContentfulStatusCode {
  switch (code) {
    case "VALIDATION_ERROR": {
      return 400;
    }
    case "NOT_FOUND_ERROR": {
      return 404;
    }
    case "CONFLICT_ERROR": {
      return 409;
    }
    case "DATA_INTEGRITY_ERROR":
    case "DATABASE_ERROR":
    case "UNKNOWN_ERROR": {
      return 500;
    }
  }
}
