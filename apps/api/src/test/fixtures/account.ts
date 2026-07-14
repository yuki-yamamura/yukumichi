import { faker } from "@faker-js/faker";

import { accountIdSchema } from "@/domain/account/models/account";
import { emailSchema } from "@/domain/email";

import type { Account } from "@/domain/account/models/account";
import type { Email } from "@/domain/email";

export function createEmail(): Email {
  return emailSchema.parse(faker.internet.email().toLowerCase());
}

export function createAccount(overrides?: Partial<Account>): Account {
  return {
    cognitoSub: faker.string.uuid(),
    email: createEmail(),
    id: accountIdSchema.parse(faker.string.uuid({ version: 7 })),
    ...overrides,
  };
}
