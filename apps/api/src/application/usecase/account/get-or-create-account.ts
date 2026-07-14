import { errAsync } from "neverthrow";

import { generateAccountId } from "@/domain/account/models/account";
import { Email } from "@/domain/email";

import type { Account } from "@/domain/account/models/account";
import type { AccountRepository } from "@/domain/account/repository";
import type { DatabaseError, DataIntegrityError } from "@/domain/error";
import type { ResultAsync } from "neverthrow";

type GetOrCreateAccountUsecaseDeps = {
  accountRepository: AccountRepository;
};

type GetOrCreateAccountUsecaseInput = {
  cognitoSub: string;
  email: string;
};

export type GetOrCreateAccountUsecase = {
  execute: (
    input: GetOrCreateAccountUsecaseInput,
  ) => ResultAsync<Account, DatabaseError | DataIntegrityError>;
};

export function GetOrCreateAccountUsecase({
  accountRepository,
}: GetOrCreateAccountUsecaseDeps): GetOrCreateAccountUsecase {
  return {
    execute: ({ cognitoSub, email }) => {
      const emailResult = Email(email);

      if (emailResult.isErr()) {
        return errAsync({
          kind: "DATA_INTEGRITY" as const,
          message: `Cognito ID token supplied an invalid email: ${emailResult.error.message}`,
        });
      }

      return accountRepository.upsertByCognitoSub({
        cognitoSub,
        email: emailResult.value,
        id: generateAccountId(),
      });
    },
  };
}
