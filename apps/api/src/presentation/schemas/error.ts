import z from "zod";

import type { ContentfulStatusCode } from "hono/utils/http-status";

export const errorResponseSchema = z.object({
  code: z.enum(["NOT_FOUND_ERROR", "VALIDATION_ERROR", "UNKNOWN_ERROR"]),
  message: z.string(),
});

export type ApiError = z.infer<typeof errorResponseSchema>;

export type ErrorCode = ApiError["code"];

export type ErrorKind = "already_archived" | "not_found" | "validation";

export function toApiError(error: { kind: ErrorKind; message: string }): ApiError {
  switch (error.kind) {
    case "not_found": {
      return { code: "NOT_FOUND_ERROR", message: error.message };
    }
    case "validation": {
      return { code: "VALIDATION_ERROR", message: error.message };
    }
    case "already_archived": {
      return { code: "VALIDATION_ERROR", message: error.message };
    }
  }
}

export function toHttpStatus(code: ErrorCode): ContentfulStatusCode {
  switch (code) {
    case "NOT_FOUND_ERROR": {
      return 404;
    }
    case "VALIDATION_ERROR": {
      return 400;
    }
    case "UNKNOWN_ERROR": {
      return 500;
    }
  }
}
