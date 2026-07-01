import { faker } from "@faker-js/faker";

import { accountIdSchema, AccountStatusEnum, emailSchema } from "@/domain/account/models/account";

import type {
  AccountId,
  Email,
  PendingAccount,
  RegisteredAccount,
} from "@/domain/account/models/account";

export function createAccountId(): AccountId {
  return accountIdSchema.parse(faker.string.uuid({ version: 7 }));
}

export function createEmail(): Email {
  return emailSchema.parse(faker.internet.email().toLowerCase());
}

export function createCognitoSub(): string {
  return faker.string.uuid();
}

export function createPendingAccount(overrides?: Partial<PendingAccount>): PendingAccount {
  const account: PendingAccount = {
    cognitoSub: createCognitoSub(),
    email: createEmail(),
    id: createAccountId(),
    status: AccountStatusEnum.PENDING,
  };

  return {
    ...account,
    ...overrides,
  };
}

export function createRegisteredAccount(overrides?: Partial<RegisteredAccount>): RegisteredAccount {
  const account: RegisteredAccount = {
    cognitoSub: createCognitoSub(),
    email: createEmail(),
    id: createAccountId(),
    status: AccountStatusEnum.REGISTERED,
  };

  return {
    ...account,
    ...overrides,
  };
}
