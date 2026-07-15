import type { Account, AccountId } from "./models/account";
import type { Email } from "@/domain/email";
import type { DatabaseError, DataIntegrityError } from "@/domain/error";
import type { ResultAsync } from "neverthrow";

export type AccountRepository = {
  findByCognitoSub: (
    cognitoSub: string,
  ) => ResultAsync<Account | undefined, DatabaseError | DataIntegrityError>;
  findOrCreateByCognitoSub: (params: {
    cognitoSub: string;
    email: Email;
    id: AccountId;
  }) => ResultAsync<Account, DatabaseError | DataIntegrityError>;
};
