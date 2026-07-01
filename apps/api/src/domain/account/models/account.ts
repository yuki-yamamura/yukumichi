import { err, ok } from "neverthrow";
import { uuidv7 } from "uuidv7";
import { z } from "zod";

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

export const emailSchema = z.email();

export type Email = z.infer<typeof emailSchema>;

export function Email(value: string): Result<Email, ValidationError> {
  const result = emailSchema.safeParse(value);

  return result.success
    ? ok(result.data)
    : err({ kind: "VALIDATION", message: result.error.message });
}

export const AccountStatusEnum = {
  PENDING: "pending",
  REGISTERED: "registered",
} as const;

export type AccountStatus = (typeof AccountStatusEnum)[keyof typeof AccountStatusEnum];

export type AccountAlreadyRegisteredError = {
  kind: "ACCOUNT_ALREADY_REGISTERED";
  message: string;
};

export type BaseAccount = {
  cognitoSub: string;
  email: Email;
  id: AccountId;
};

export type PendingAccount = Readonly<
  BaseAccount & {
    status: typeof AccountStatusEnum.PENDING;
  }
>;

export type RegisteredAccount = Readonly<
  BaseAccount & {
    status: typeof AccountStatusEnum.REGISTERED;
  }
>;

export type Account = PendingAccount | RegisteredAccount;

export function PendingAccount({
  cognitoSub,
  email,
  id,
}: {
  cognitoSub: string;
  email: string;
  id: AccountId;
}): Result<PendingAccount, ValidationError> {
  const emailResult = Email(email);
  if (emailResult.isErr()) {
    return err(emailResult.error);
  }

  return ok({
    cognitoSub,
    email: emailResult.value,
    id,
    status: AccountStatusEnum.PENDING,
  });
}

export function registerAccount(pendingAccount: PendingAccount): RegisteredAccount {
  return {
    ...pendingAccount,
    status: AccountStatusEnum.REGISTERED,
  };
}
