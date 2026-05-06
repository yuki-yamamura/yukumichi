export const errorCodeMap = {
  conflict: "CONFLICT_ERROR", // Conflict error, such as when trying to create a resource that already exists
  data_integrity: "DATA_INTEGRITY_ERROR", // Data integrity error, such as when reconstructing a domain object from corrupted DB data
  not_found: "NOT_FOUND_ERROR", // Not found error, such as when a requested resource does not exist
  unknown: "UNKNOWN_ERROR", // Unknown error, such as unhandled exceptions or errors without a specific kind
  validation: "VALIDATION_ERROR", // Validation error, such as invalid input or missing required fields on domain logic level
} as const;
