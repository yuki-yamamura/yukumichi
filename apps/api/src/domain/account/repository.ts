import type { Account, AccountId, PendingAccount, RegisteredAccount } from "./models/account";
import type { DatabaseError, DataIntegrityError, NotFoundError } from "@/domain/error";
import type { ResultAsync } from "neverthrow";

export type AccountRepository = {
  create: (pendingAccount: PendingAccount) => ResultAsync<AccountId, DatabaseError>;
  deleteByCognitoSub: (cognitoSub: string) => ResultAsync<void, DatabaseError>;
  findByCognitoSub: (
    cognitoSub: string,
  ) => ResultAsync<Account, DatabaseError | DataIntegrityError | NotFoundError>;
  register: (
    registeredAccount: RegisteredAccount,
  ) => ResultAsync<RegisteredAccount, DatabaseError | DataIntegrityError | NotFoundError>;
};
