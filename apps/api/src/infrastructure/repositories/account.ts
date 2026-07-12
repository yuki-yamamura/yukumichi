import { eq } from "drizzle-orm";
import { err, ok, ResultAsync } from "neverthrow";

import { AccountId, AccountStatusEnum } from "@/domain/account/models/account";
import { Email } from "@/domain/email";
import { accounts } from "@/infrastructure/database/schema";

import type { Account, PendingAccount, RegisteredAccount } from "@/domain/account/models/account";
import type { AccountRepository } from "@/domain/account/repository";
import type { Database } from "@/infrastructure/database/client";

export function AccountRepository(db: Database): AccountRepository {
  return {
    create: (pendingAccount: PendingAccount) =>
      ResultAsync.fromPromise(
        db
          .insert(accounts)
          .values({
            cognitoSub: pendingAccount.cognitoSub,
            email: pendingAccount.email,
            id: pendingAccount.id,
            status: pendingAccount.status,
          })
          .returning({ id: accounts.id }),
        (error) =>
          error instanceof Error
            ? { kind: "DATABASE" as const, message: error.message }
            : { kind: "DATABASE" as const, message: String(error) },
      ).andThen((rows) =>
        AccountId(rows[0].id).mapErr((error) => ({
          kind: "DATABASE" as const,
          message: error.message,
        })),
      ),

    deleteByCognitoSub: (cognitoSub: string) =>
      ResultAsync.fromPromise(
        db.delete(accounts).where(eq(accounts.cognitoSub, cognitoSub)),
        (error) =>
          error instanceof Error
            ? { kind: "DATABASE" as const, message: error.message }
            : { kind: "DATABASE" as const, message: String(error) },
      ).map(() => {}),

    findByCognitoSub: (cognitoSub: string) =>
      ResultAsync.fromPromise(
        db.select().from(accounts).where(eq(accounts.cognitoSub, cognitoSub)),
        (error) =>
          error instanceof Error
            ? { kind: "DATABASE" as const, message: error.message }
            : { kind: "DATABASE" as const, message: String(error) },
      )
        .andThen((rows) =>
          rows.length === 0
            ? err({
                kind: "NOT_FOUND" as const,
                message: `Account not found for cognitoSub: ${cognitoSub}`,
              })
            : ok(rows[0]),
        )
        .andThen((row) => {
          const idResult = AccountId(row.id).mapErr((error) => ({
            kind: "DATA_INTEGRITY" as const,
            message: error.message,
          }));
          const emailResult = Email(row.email).mapErr((error) => ({
            kind: "DATA_INTEGRITY" as const,
            message: error.message,
          }));

          if (idResult.isErr()) return err(idResult.error);
          if (emailResult.isErr()) return err(emailResult.error);

          const base = {
            cognitoSub: row.cognitoSub,
            email: emailResult.value,
            id: idResult.value,
          };

          if (row.status === AccountStatusEnum.PENDING) {
            const account: Account = { ...base, status: AccountStatusEnum.PENDING };

            return ok(account);
          }

          const account: Account = { ...base, status: AccountStatusEnum.REGISTERED };

          return ok(account);
        }),

    register: (registeredAccount: RegisteredAccount) =>
      ResultAsync.fromPromise(
        db
          .update(accounts)
          .set({
            status: registeredAccount.status,
            updatedAt: new Date(),
          })
          .where(eq(accounts.id, registeredAccount.id))
          .returning(),
        (error) =>
          error instanceof Error
            ? { kind: "DATABASE" as const, message: error.message }
            : { kind: "DATABASE" as const, message: String(error) },
      )
        .andThen((rows) =>
          rows.length === 0
            ? err({
                kind: "NOT_FOUND" as const,
                message: `Account not found: ${registeredAccount.id}`,
              })
            : ok(rows[0]),
        )
        .andThen((row) => {
          const idResult = AccountId(row.id).mapErr((error) => ({
            kind: "DATA_INTEGRITY" as const,
            message: error.message,
          }));
          const emailResult = Email(row.email).mapErr((error) => ({
            kind: "DATA_INTEGRITY" as const,
            message: error.message,
          }));

          if (idResult.isErr()) return err(idResult.error);
          if (emailResult.isErr()) return err(emailResult.error);

          const account: RegisteredAccount = {
            cognitoSub: row.cognitoSub,
            email: emailResult.value,
            id: idResult.value,
            status: AccountStatusEnum.REGISTERED,
          };

          return ok(account);
        }),
  };
}
