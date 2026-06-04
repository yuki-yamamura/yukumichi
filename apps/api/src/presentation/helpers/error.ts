import { ErrorCodeEnum } from "@yukumichi/shared/error";

import type { ErrorCode } from "@yukumichi/shared/error";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export type ErrorKind = keyof typeof ErrorCodeEnum;

export function toApiError<K extends ErrorKind>(error: {
  kind: K;
  message: string;
}): { code: (typeof ErrorCodeEnum)["UNKNOWN"] | (typeof ErrorCodeEnum)[K]; message: string } {
  return {
    code: ErrorCodeEnum[error.kind],
    message: error.message,
  };
}

export function toHttpStatusCode(code: ErrorCode): ContentfulStatusCode {
  switch (code) {
    case "BAD_REQUEST_ERROR": {
      return 400;
    }
    case "NOT_FOUND_ERROR": {
      return 404;
    }
    case "SPOT_DUPLICATED_ERROR": {
      return 409;
    }
    case "DATA_INTEGRITY_ERROR":
    case "DATABASE_ERROR":
    case "UNKNOWN_ERROR":
    case "VALIDATION_ERROR": {
      return 500;
    }
    default: {
      code satisfies never;

      return 500;
    }
  }
}
