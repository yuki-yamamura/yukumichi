import { ErrorCodeEnum } from "@yukumichi/shared/error";
import { z } from "zod";

export const badRequestErrorResponseSchema = z.object({
  code: z.literal(ErrorCodeEnum.BAD_REQUEST),
  message: z.string(),
});

export const notFoundErrorResponseSchema = z.object({
  code: z.literal(ErrorCodeEnum.NOT_FOUND),
  message: z.string(),
});

export const unknownErrorResponseSchema = z.object({
  code: z.literal(ErrorCodeEnum.UNKNOWN),
  message: z.string(),
});
