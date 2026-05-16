import { errorResponseSchema } from "@yukumichi/shared/error";
import { DetailedError, parseResponse } from "hono/client";

import { err, ok } from "@/utils/result";

import type { Result } from "@/utils/result";
import type { ApiError } from "@yukumichi/shared/error";
import type { ClientResponse } from "hono/client";

type InferResponseData<T> = T extends ClientResponse<infer ResponseData> ? ResponseData : never;

export async function toResult<T extends ClientResponse<unknown>>(
  promise: Promise<T>,
): Promise<Result<Exclude<InferResponseData<T>, ApiError>, ApiError>> {
  try {
    // NOTE: `parseResponse` returns `undefined`, and it causes type mismatch from inferred type. So we need to fallback to `null` here.
    const data = (await parseResponse(promise)) ?? null;

    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- `parseResponse` returns the body shape but cannot statically narrow it against the typed Hono response union. The assertion bridges the inferred body to the caller's success type.
    return ok(data as Exclude<InferResponseData<T>, ApiError>);
  } catch (error) {
    if (error instanceof DetailedError) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- `error.detail` is typed as `any` by Hono's DetailedError. We hand it to Zod for runtime validation.
      const parsedError = errorResponseSchema.safeParse(error.detail?.data);
      if (parsedError.success) {
        return err(parsedError.data);
      }

      return err({
        code: "UNKNOWN_ERROR",
        message: error.message,
      });
    }

    return err({
      code: "UNKNOWN_ERROR",
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
