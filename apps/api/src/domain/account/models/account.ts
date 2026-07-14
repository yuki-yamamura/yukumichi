import { err, ok } from "neverthrow";
import { uuidv7 } from "uuidv7";
import { z } from "zod";

import type { Email } from "@/domain/email";
import type { ValidationError } from "@/domain/error";
import type { Result } from "neverthrow";

export const accountIdSchema = z.uuidv7().brand<"AccountId">();

export type AccountId = z.infer<typeof accountIdSchema>;

export function generateAccountId(): AccountId {
  return accountIdSchema.parse(uuidv7());
}

export function AccountId(value: string): Result<AccountId, ValidationError> {
  const result = accountIdSchema.safeParse(value);

  return result.success
    ? ok(result.data)
    : err({ kind: "VALIDATION", message: result.error.message });
}

export type Account = Readonly<{
  cognitoSub: string;
  email: Email;
  id: AccountId;
}>;
