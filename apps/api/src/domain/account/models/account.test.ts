import { faker } from "@faker-js/faker";
import z from "zod";

import { Email } from "@/domain/email";
import {
  createAccountId,
  createCognitoSub,
  createEmail,
  createPendingAccount,
} from "@/test/fixtures/account";

import {
  AccountId,
  AccountStatusEnum,
  generateAccountId,
  PendingAccount,
  registerAccount,
} from "./account";

describe("AccountId", () => {
  it("should return the branded id when the input is a valid uuidv7", () => {
    // Given
    const value = faker.string.uuid({ version: 7 });

    // When
    const result = AccountId(value);

    // Then
    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toBe(value);
  });

  it("should return a validation error when the input is not a valid uuidv7", () => {
    // When
    const result = AccountId("not-a-uuid");

    // Then
    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr()).toEqual({
      kind: "VALIDATION",
      message: expect.any(String),
    });
  });
});

describe("generateAccountId", () => {
  it("should return a valid id", () => {
    // When
    const result = generateAccountId();

    // Then
    expect(z.uuidv7().safeParse(result).success).toBe(true);
  });
});

describe("Email", () => {
  it("should return the branded email when the input is a valid email", () => {
    // Given
    const value = faker.internet.email().toLowerCase();

    // When
    const result = Email(value);

    // Then
    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toBe(value);
  });

  it.each([
    { label: "empty string", value: "" },
    { label: "missing @", value: "not-an-email" },
    { label: "missing domain", value: "alice@" },
    { label: "missing local part", value: "@example.com" },
  ])("should return a validation error when the input is $label", ({ value }) => {
    // When
    const result = Email(value);

    // Then
    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr()).toEqual({
      kind: "VALIDATION",
      message: expect.any(String),
    });
  });
});

describe("PendingAccount", () => {
  it("should build a pending account preserving the base fields", () => {
    // Given
    const id = createAccountId();
    const cognitoSub = createCognitoSub();
    const email = createEmail();

    // When
    const account = PendingAccount({ cognitoSub, email, id });

    // Then
    expect(account).toEqual({
      cognitoSub,
      email,
      id,
      status: AccountStatusEnum.PENDING,
    });
  });
});

describe("registerAccount", () => {
  it("should return a registered account preserving base fields", () => {
    // Given
    const pendingAccount = createPendingAccount();

    // When
    const result = registerAccount(pendingAccount);

    // Then
    expect(result).toEqual({
      cognitoSub: pendingAccount.cognitoSub,
      email: pendingAccount.email,
      id: pendingAccount.id,
      status: AccountStatusEnum.REGISTERED,
    });
  });

  it("should not mutate the input pending account", () => {
    // Given
    const pendingAccount = createPendingAccount();
    const snapshot = { ...pendingAccount };

    // When
    registerAccount(pendingAccount);

    // Then
    expect(pendingAccount).toEqual(snapshot);
  });
});

describe("createEmail (fixture)", () => {
  it("should produce a value that survives Email() validation", () => {
    // When
    const value = createEmail();
    const result = Email(value);

    // Then
    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toBe(value);
  });
});
