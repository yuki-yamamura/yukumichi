import z from "zod";

export const ERROR_CODES = [
  "CONFLICT_ERROR",
  "DATA_INTEGRITY_ERROR",
  "DATABASE_ERROR",
  "NOT_FOUND_ERROR",
  "UNKNOWN_ERROR",
  "VALIDATION_ERROR",
] as const;

export type ErrorCode = (typeof ERROR_CODES)[number];

export const errorResponseSchema = z.object({
  code: z.enum(ERROR_CODES),
  message: z.string(),
});

export type ApiError = z.infer<typeof errorResponseSchema>;
