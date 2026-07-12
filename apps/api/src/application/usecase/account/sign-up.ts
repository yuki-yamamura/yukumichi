import { errAsync, okAsync } from "neverthrow";

import { generateAccountId, PendingAccount } from "@/domain/account/models/account";

import type { AuthGateway, AuthGatewayError } from "@/domain/account/auth-gateway";
import type { AccountAlreadyRegisteredError } from "@/domain/account/models/account";
import type { AccountRepository } from "@/domain/account/repository";
import type { Email } from "@/domain/email";
import type { DatabaseError, ValidationError } from "@/domain/error";
import type { ResultAsync } from "neverthrow";

type SignUpUsecaseDeps = {
  accountRepository: AccountRepository;
  authGateway: AuthGateway;
};

type SignUpUsecaseInput = {
  email: Email;
  password: string;
};

export type SignUpUsecase = {
  execute: (
    input: SignUpUsecaseInput,
  ) => ResultAsync<
    void,
    AccountAlreadyRegisteredError | AuthGatewayError | DatabaseError | ValidationError
  >;
};

export function SignUpUsecase({
  accountRepository,
  authGateway,
}: SignUpUsecaseDeps): SignUpUsecase {
  return {
    execute: ({ email, password }) =>
      authGateway
        .signUp({ email, password })
        .mapErr((error) =>
          error.kind === "AUTH_USER_ALREADY_EXISTS"
            ? ({ kind: "ACCOUNT_ALREADY_REGISTERED", message: error.message } as const)
            : error,
        )
        .andThen((sub) => {
          const pendingAccount = PendingAccount({
            cognitoSub: sub,
            email,
            id: generateAccountId(),
          });

          return accountRepository.create(pendingAccount).orElse((error) =>
            authGateway
              .deleteBySub(sub)
              .orElse(() => okAsync(undefined))
              .andThen(() => errAsync(error)),
          );
        })
        .map(() => {}),
  };
}
