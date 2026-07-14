import { faker } from "@faker-js/faker";

import { accountIdSchema } from "@/domain/account/models/account";
import { emailSchema } from "@/domain/email";

import type { Account, AccountId } from "@/domain/account/models/account";
import type { Email } from "@/domain/email";

export function createAccountId(): AccountId {
  return accountIdSchema.parse(faker.string.uuid({ version: 7 }));
}

export function createEmail(): Email {
  return emailSchema.parse(faker.internet.email().toLowerCase());
}

export function createCognitoSub(): string {
  return faker.string.uuid();
}

export function createAccount(overrides?: Partial<Account>): Account {
  return {
    cognitoSub: createCognitoSub(),
    email: createEmail(),
    id: createAccountId(),
    ...overrides,
  };
}
