import { ErrorCodeEnum } from "@yukumichi/shared/error";
import { z } from "zod";

export const accountAlreadyRegisteredErrorResponseSchema = z.object({
  code: z.literal(ErrorCodeEnum.ACCOUNT_ALREADY_REGISTERED),
  message: z.string(),
});

export const authGatewayErrorResponseSchema = z.object({
  code: z.literal(ErrorCodeEnum.AUTH_GATEWAY),
  message: z.string(),
});

export const badRequestErrorResponseSchema = z.object({
  code: z.literal(ErrorCodeEnum.BAD_REQUEST),
  message: z.string(),
});

export const codeInvalidErrorResponseSchema = z.object({
  code: z.literal(ErrorCodeEnum.CODE_INVALID),
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
