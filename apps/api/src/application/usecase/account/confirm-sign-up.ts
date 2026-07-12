import { errAsync, okAsync } from "neverthrow";

import { AccountStatusEnum, registerAccount } from "@/domain/account/models/account";

import type {
  AuthGateway,
  AuthGatewayError,
  CodeInvalidError,
} from "@/domain/account/auth-gateway";
import type { AccountRepository } from "@/domain/account/repository";
import type { Email } from "@/domain/email";
import type { DatabaseError, DataIntegrityError, NotFoundError } from "@/domain/error";
import type { ResultAsync } from "neverthrow";

type ConfirmSignUpUsecaseDeps = {
  accountRepository: AccountRepository;
  authGateway: AuthGateway;
};

type ConfirmSignUpUsecaseInput = {
  code: string;
  email: Email;
};

type ConfirmSignUpUsecaseError =
  | AuthGatewayError
  | CodeInvalidError
  | DatabaseError
  | DataIntegrityError
  | NotFoundError;

export type ConfirmSignUpUsecase = {
  execute: (input: ConfirmSignUpUsecaseInput) => ResultAsync<void, ConfirmSignUpUsecaseError>;
};

export function ConfirmSignUpUsecase({
  accountRepository,
  authGateway,
}: ConfirmSignUpUsecaseDeps): ConfirmSignUpUsecase {
  return {
    execute: ({ code, email }) =>
      authGateway
        .confirmUser({ code, email })
        .orElse((error) =>
          error.kind === "AUTH_USER_ALREADY_CONFIRMED" ? okAsync(undefined) : errAsync(error),
        )
        .andThen(() => accountRepository.findByEmail(email))
        .andThen((account) => {
          // If the account is already registered, we should not do anything for the API idempotent.
          if (account.status === AccountStatusEnum.REGISTERED) {
            return okAsync(undefined);
          }

          return accountRepository.register(registerAccount(account)).map(() => {});
        }),
  };
}
