import { errorCodeMap } from "@/presentation/constants/error";

import type { ApiError, ErrorCode, ErrorKind } from "@/presentation/types/error";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export function toApiError(error: { kind: ErrorKind; message: string }): ApiError {
  return {
    code: errorCodeMap[error.kind],
    message: error.message,
  };
}

export function toHttpStatus(code: ErrorCode): ContentfulStatusCode {
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
    case "UNKNOWN_ERROR": {
      return 500;
    }
  }
}
