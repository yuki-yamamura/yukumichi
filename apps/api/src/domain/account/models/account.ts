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
  email: Email;
  id: AccountId;
}): PendingAccount {
  return {
    cognitoSub,
    email,
    id,
    status: AccountStatusEnum.PENDING,
  };
}

export function registerAccount(pendingAccount: PendingAccount): RegisteredAccount {
  return {
    ...pendingAccount,
    status: AccountStatusEnum.REGISTERED,
  };
}
