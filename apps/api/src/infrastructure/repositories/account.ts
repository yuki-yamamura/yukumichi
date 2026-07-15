import { eq } from "drizzle-orm";
import { err, ok, ResultAsync } from "neverthrow";

import { AccountId } from "@/domain/account/models/account";
import { Email } from "@/domain/email";
import { accounts } from "@/infrastructure/database/schema";

import type { Account } from "@/domain/account/models/account";
import type { AccountRepository } from "@/domain/account/repository";
import type { Database } from "@/infrastructure/database/client";

type AccountRow = typeof accounts.$inferSelect;

function toDatabaseError(error: unknown): { kind: "DATABASE"; message: string } {
  return {
    kind: "DATABASE" as const,
    message: error instanceof Error ? error.message : String(error),
  };
}

function toAccount(row: AccountRow) {
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

  const account: Account = {
    cognitoSub: row.cognitoSub,
    email: emailResult.value,
    id: idResult.value,
  };

  return ok(account);
}

export function AccountRepository(db: Database): AccountRepository {
  return {
    findByCognitoSub: (cognitoSub) =>
      ResultAsync.fromPromise(
        db.select().from(accounts).where(eq(accounts.cognitoSub, cognitoSub)),
        toDatabaseError,
      ).andThen((rows) => (rows.length === 0 ? ok(undefined) : toAccount(rows[0]))),

    findOrCreateByCognitoSub: ({ cognitoSub, email, id }) =>
      ResultAsync.fromPromise(
        db
          .insert(accounts)
          .values({ cognitoSub, email, id })
          .onConflictDoNothing({ target: accounts.cognitoSub })
          .returning(),
        toDatabaseError,
      ).andThen((inserted) => {
        if (inserted.length > 0) return toAccount(inserted[0]);

        return ResultAsync.fromPromise(
          db.select().from(accounts).where(eq(accounts.cognitoSub, cognitoSub)),
          toDatabaseError,
        ).andThen((rows) => {
          if (rows.length === 0) {
            return err({
              kind: "DATABASE" as const,
              message: `Upsert for ${cognitoSub} produced no row on insert or select`,
            });
          }

          return toAccount(rows[0]);
        });
      }),
  };
}
