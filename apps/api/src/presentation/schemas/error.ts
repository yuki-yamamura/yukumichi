import z from "zod";

import type { ContentfulStatusCode } from "hono/utils/http-status";

export const errorResponseSchema = z.object({
  code: z.enum([
    "CONFLICT_ERROR",
    "DATA_INTEGRITY_ERROR",
    "NOT_FOUND_ERROR",
    "VALIDATION_ERROR",
    "UNKNOWN_ERROR",
  ]),
  message: z.string(),
});

export type ApiError = z.infer<typeof errorResponseSchema>;

type ErrorCode = ApiError["code"];

type ErrorKind =
  | "conflict" // Conflict error, such as when trying to create a resource that already exists
  | "data_integrity" // Data integrity error, such as when reconstructing a domain object from corrupted DB data
  | "not_found" // Not found error, such as when a requested resource does not exist
  | "validation"; // Validation error, such as invalid input or missing required fields on domain logic level

export function toApiError(error: { kind: ErrorKind; message: string }): ApiError {
  switch (error.kind) {
    case "conflict": {
      return { code: "CONFLICT_ERROR", message: error.message };
    }
    case "data_integrity": {
      return { code: "DATA_INTEGRITY_ERROR", message: error.message };
    }
    case "not_found": {
      return { code: "NOT_FOUND_ERROR", message: error.message };
    }
    case "validation": {
      return { code: "VALIDATION_ERROR", message: error.message };
    }
  }
}

export function toHttpStatus(code: ErrorCode): ContentfulStatusCode {
  switch (code) {
    case "CONFLICT_ERROR": {
      return 409;
    }
    case "NOT_FOUND_ERROR": {
      return 404;
    }
    case "VALIDATION_ERROR": {
      return 400;
    }
    case "DATA_INTEGRITY_ERROR":
    case "UNKNOWN_ERROR": {
      return 500;
    }
  }
}
