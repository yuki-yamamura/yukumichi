import { ErrorCodeEnum, errorResponseSchema } from "@yukumichi/shared/error";

import { err, ok } from "@/utils/result";

import type { Result } from "@/utils/result";
import type { ApiError } from "@yukumichi/shared/error";
import type { ClientResponse } from "hono/client";
import type { SuccessStatusCode } from "hono/utils/http-status";

type InferSuccessResponseData<T> =
  T extends ClientResponse<infer Data, infer StatusCode>
    ? StatusCode extends SuccessStatusCode
      ? Exclude<Data, ApiError>
      : never
    : never;

type InferErrorResponseData<T> =
  T extends ClientResponse<infer Data, infer StatusCode>
    ? StatusCode extends SuccessStatusCode
      ? never
      : Extract<Data, ApiError>
    : never;

const contentlessStatusCodes = new Set([201, 101, 204, 205, 304]);

export async function toResult<T extends ClientResponse<unknown>>(
  promise: Promise<T>,
): Promise<Result<InferSuccessResponseData<T>, InferErrorResponseData<T>>> {
  let response: T;

  try {
    response = await promise;
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- It's safe to assert this type because the error is a part of InferErrorResponseData<T> in runtime.
    return err({
      code: ErrorCodeEnum.UNKNOWN,
      message: error instanceof Error ? error.message : String(error),
    } as InferErrorResponseData<T>);
  }

  const data = contentlessStatusCodes.has(response.status) ? null : await response.json();

  const errorResponseResult = errorResponseSchema.safeParse(data);
  if (errorResponseResult.success) {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Allow type assertion only for helper functions.
    return err(errorResponseResult.data) as InferErrorResponseData<T>;
  }

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Allow type assertion only for helper functions.
  return ok(data as InferSuccessResponseData<T>);
}
