import { err, ok } from "@/utils/result";

import type { Result } from "@/utils/result";
import type { ApiError } from "@sanpo/api";
import type { ClientResponse } from "hono/client";

type InferBody<R> = R extends ClientResponse<infer Body, number, string> ? Body : never;

function isApiError(data: unknown): data is ApiError {
  if (typeof data !== "object" || data === null) {
    return false;
  }
  if (!("code" in data) || !("message" in data)) {
    return false;
  }

  return typeof data.code === "string" && typeof data.message === "string";
}

export async function toResult<R extends ClientResponse<unknown, number, string>>(
  promise: Promise<R>,
): Promise<Result<Exclude<InferBody<R>, ApiError>, ApiError>> {
  try {
    const response = await promise;
    const text = await response.text();
    if (text === "") {
      if (response.ok) {
        return ok(null as Exclude<InferBody<R>, ApiError>);
      }

      return err({
        code: "UNKNOWN_ERROR",
        message: `Empty response (status ${response.status})`,
      });
    }
    const data: unknown = JSON.parse(text);
    if (isApiError(data)) {
      return err(data);
    }

    return ok(data as Exclude<InferBody<R>, ApiError>);
  } catch (error) {
    return err({
      code: "UNKNOWN_ERROR",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
