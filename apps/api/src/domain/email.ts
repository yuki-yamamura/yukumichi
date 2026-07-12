import { err, ok } from "neverthrow";
import { z } from "zod";

import type { ValidationError } from "@/domain/error";
import type { Result } from "neverthrow";

export const emailSchema = z.email().brand<"Email">();

export type Email = z.infer<typeof emailSchema>;

export function Email(value: string): Result<Email, ValidationError> {
  const result = emailSchema.safeParse(value);

  return result.success
    ? ok(result.data)
    : err({ kind: "VALIDATION", message: result.error.message });
}
