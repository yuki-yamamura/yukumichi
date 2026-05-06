import type { errorCodeMap } from "@/presentation/constants/error";
import type { errorResponseSchema } from "@/presentation/schemas/error";
import type z from "zod";

export type ApiError = z.infer<typeof errorResponseSchema>;

export type ErrorKind = keyof typeof errorCodeMap;

export type ErrorCode = ApiError["code"];
