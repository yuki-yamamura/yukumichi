import { eq } from "drizzle-orm";
import { inject } from "vitest";

import { accounts } from "@/infrastructure/database/schema";
import { createTestDatabaseHelper } from "@/test/database/test-database-helper";
import { createAccount } from "@/test/fixtures/account";

import { AccountRepository } from "./account";

const databaseUrl = inject("databaseUrl");
const testDb = createTestDatabaseHelper({ DATABASE_URL: databaseUrl });
const repository = AccountRepository(testDb.db);

describe("AccountRepository", () => {
  beforeEach(async () => {
    await testDb.truncateTables();
  });

  afterAll(async () => {
    await testDb.cleanup();
  });

  describe("findByCognitoSub", () => {
    it("should return the account when a row exists for the cognitoSub", async () => {
      // Given
      const account = createAccount();
      await testDb.db.insert(accounts).values({
        cognitoSub: account.cognitoSub,
        email: account.email,
        id: account.id,
      });

      // When
      const result = await repository.findByCognitoSub(account.cognitoSub);

      // Then
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual(account);
    });

    it("should return undefined when no row exists for the cognitoSub", async () => {
      // When
      const result = await repository.findByCognitoSub("non-existent-sub");

      // Then
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBeUndefined();
    });
  });

  describe("findOrCreateByCognitoSub", () => {
    it("should insert a row when the cognitoSub is new", async () => {
      // Given
      const account = createAccount();

      // When
      const result = await repository.findOrCreateByCognitoSub({
        cognitoSub: account.cognitoSub,
        email: account.email,
        id: account.id,
      });

      // Then
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual(account);

      const rows = await testDb.db
        .select()
        .from(accounts)
        .where(eq(accounts.cognitoSub, account.cognitoSub));
      expect(rows).toHaveLength(1);
    });

    it("should return the existing row without changing it when the cognitoSub already exists", async () => {
      // Given
      const existing = createAccount();
      await testDb.db.insert(accounts).values({
        cognitoSub: existing.cognitoSub,
        email: existing.email,
        id: existing.id,
      });
      const attempted = createAccount({ cognitoSub: existing.cognitoSub });

      // When
      const result = await repository.findOrCreateByCognitoSub({
        cognitoSub: attempted.cognitoSub,
        email: attempted.email,
        id: attempted.id,
      });

      // Then — the existing row wins; email/id are not overwritten
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual(existing);

      const rows = await testDb.db
        .select()
        .from(accounts)
        .where(eq(accounts.cognitoSub, existing.cognitoSub));
      expect(rows).toHaveLength(1);
      expect(rows[0]).toMatchObject({
        cognitoSub: existing.cognitoSub,
        email: existing.email,
        id: existing.id,
      });
    });
  });
});
