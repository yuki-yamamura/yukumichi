import z from "zod";

const ERROR_CODES = [
  "BAD_REQUEST_ERROR",
  "DATA_INTEGRITY_ERROR",
  "DATABASE_ERROR",
  "NOT_FOUND_ERROR",
  "SPOT_DUPLICATED_ERROR",
  "UNAUTHORIZED_ERROR",
  "UNKNOWN_ERROR",
  "VALIDATION_ERROR",
] as const;

export type ErrorCode = (typeof ERROR_CODES)[number];

export const ErrorCodeEnum = {
  BAD_REQUEST: "BAD_REQUEST_ERROR", // Bad request error, such as invalid input or missing required fields on API level
  DATA_INTEGRITY: "DATA_INTEGRITY_ERROR", // Data integrity error, such as when reconstructing a domain object from corrupted DB data
  DATABASE: "DATABASE_ERROR", // Database error, such as when a database operation fails
  NOT_FOUND: "NOT_FOUND_ERROR", // Not found error, such as when a requested resource does not exist
  SPOT_DUPLICATED: "SPOT_DUPLICATED_ERROR", // Spot duplicated error, such as when trying to create a spot that already exists
  UNAUTHORIZED: "UNAUTHORIZED_ERROR", // Missing or invalid JWT on a protected endpoint
  UNKNOWN: "UNKNOWN_ERROR", // Unknown error, such as unhandled exceptions or errors without a specific kind
  VALIDATION: "VALIDATION_ERROR", // Validation error, such as invalid input or missing required fields on domain logic level
} as const satisfies Record<string, ErrorCode>;

export const errorResponseSchema = z.object({
  code: z.enum(ERROR_CODES),
  message: z.string(),
});

export type ApiError = z.infer<typeof errorResponseSchema>;
