import { eq } from "drizzle-orm";
import { inject } from "vitest";

import { AccountStatusEnum, registerAccount } from "@/domain/account/models/account";
import { accounts } from "@/infrastructure/database/schema";
import { createTestDatabaseHelper } from "@/test/database/test-database-helper";
import { createPendingAccount, createRegisteredAccount } from "@/test/fixtures/account";

import { AccountRepository } from "./account";

const appEnv = inject("appEnv");
const databaseUrl = inject("databaseUrl");
const testDb = createTestDatabaseHelper({ APP_ENV: appEnv, DATABASE_URL: databaseUrl });
const repository = AccountRepository(testDb.db);

describe("AccountRepository", () => {
  beforeEach(async () => {
    await testDb.truncateTables();
  });

  afterAll(async () => {
    await testDb.cleanup();
  });

  describe("create", () => {
    it("should store a pending account and return its id", async () => {
      // Given
      const pendingAccount = createPendingAccount();

      // When
      const result = await repository.create(pendingAccount);

      // Then
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(pendingAccount.id);

      // Postcondition
      const rows = await testDb.db
        .select()
        .from(accounts)
        .where(eq(accounts.id, pendingAccount.id));
      expect(rows).toHaveLength(1);
      expect(rows[0]).toEqual({
        cognitoSub: pendingAccount.cognitoSub,
        createdAt: expect.any(Date),
        email: pendingAccount.email,
        id: pendingAccount.id,
        status: AccountStatusEnum.PENDING,
        updatedAt: expect.any(Date),
      });
    });
  });

  describe("findByCognitoSub", () => {
    it("should return a pending account by cognitoSub", async () => {
      // Given
      const pendingAccount = createPendingAccount();
      await testDb.db.insert(accounts).values({
        cognitoSub: pendingAccount.cognitoSub,
        email: pendingAccount.email,
        id: pendingAccount.id,
        status: pendingAccount.status,
      });

      // When
      const result = await repository.findByCognitoSub(pendingAccount.cognitoSub);

      // Then
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual(pendingAccount);
    });

    it("should return a registered account by cognitoSub", async () => {
      // Given
      const registeredAccount = createRegisteredAccount();
      await testDb.db.insert(accounts).values({
        cognitoSub: registeredAccount.cognitoSub,
        email: registeredAccount.email,
        id: registeredAccount.id,
        status: registeredAccount.status,
      });

      // When
      const result = await repository.findByCognitoSub(registeredAccount.cognitoSub);

      // Then
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual(registeredAccount);
    });

    it("should return not_found when the account does not exist", async () => {
      // Given
      const cognitoSub = "non-existent-sub";

      // When
      const result = await repository.findByCognitoSub(cognitoSub);

      // Then
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toEqual({
        kind: "NOT_FOUND",
        message: expect.any(String),
      });
    });
  });

  describe("register", () => {
    it("should update status to registered and return the registered account", async () => {
      // Given
      const pendingAccount = createPendingAccount();
      await testDb.db.insert(accounts).values({
        cognitoSub: pendingAccount.cognitoSub,
        email: pendingAccount.email,
        id: pendingAccount.id,
        status: pendingAccount.status,
      });
      const registeredAccount = registerAccount(pendingAccount);

      // When
      const result = await repository.register(registeredAccount);

      // Then
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual(registeredAccount);

      // Postcondition
      const rows = await testDb.db
        .select()
        .from(accounts)
        .where(eq(accounts.id, pendingAccount.id));
      expect(rows).toHaveLength(1);
      expect(rows[0].status).toBe(AccountStatusEnum.REGISTERED);
    });

    it("should return not_found when the account does not exist", async () => {
      // Given
      const registeredAccount = createRegisteredAccount();

      // When
      const result = await repository.register(registeredAccount);

      // Then
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toEqual({
        kind: "NOT_FOUND",
        message: expect.any(String),
      });
    });
  });

  describe("deleteByCognitoSub", () => {
    it("should delete the account with the given cognitoSub", async () => {
      // Given
      const pendingAccount = createPendingAccount();
      await testDb.db.insert(accounts).values({
        cognitoSub: pendingAccount.cognitoSub,
        email: pendingAccount.email,
        id: pendingAccount.id,
        status: pendingAccount.status,
      });

      // When
      const result = await repository.deleteByCognitoSub(pendingAccount.cognitoSub);

      // Then
      expect(result.isOk()).toBe(true);

      // Postcondition
      const rows = await testDb.db
        .select()
        .from(accounts)
        .where(eq(accounts.cognitoSub, pendingAccount.cognitoSub));
      expect(rows).toHaveLength(0);
    });

    it("should succeed even if no account matches", async () => {
      // Given
      const cognitoSub = "non-existent-sub";

      // When
      const result = await repository.deleteByCognitoSub(cognitoSub);

      // Then
      expect(result.isOk()).toBe(true);
    });
  });
});
