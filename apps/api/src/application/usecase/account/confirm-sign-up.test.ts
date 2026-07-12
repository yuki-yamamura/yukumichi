import { faker } from "@faker-js/faker";
import { errAsync, okAsync } from "neverthrow";

import { AccountStatusEnum } from "@/domain/account/models/account";
import { createPendingAccount, createRegisteredAccount } from "@/test/fixtures/account";

import { ConfirmSignUpUsecase } from "./confirm-sign-up";

import type { AuthGateway } from "@/domain/account/auth-gateway";
import type { AccountRepository } from "@/domain/account/repository";

describe("ConfirmSignUpUsecase", () => {
  describe("execute", () => {
    it("should mark the account as REGISTERED when Cognito confirmation and DB update both succeed", async () => {
      // Given
      const pending = createPendingAccount();
      const registered = { ...pending, status: AccountStatusEnum.REGISTERED };
      const authGateway = createAuthGateway({
        confirmUser: vi.fn().mockReturnValue(okAsync(undefined)),
      });
      const accountRepository = createAccountRepository({
        findByEmail: vi.fn().mockReturnValue(okAsync(pending)),
        register: vi.fn().mockReturnValue(okAsync(registered)),
      });
      const usecase = ConfirmSignUpUsecase({ accountRepository, authGateway });

      // When
      const result = await usecase.execute({
        code: faker.string.numeric(6),
        email: pending.email,
      });

      // Then
      expect(result.isOk()).toBe(true);
      expect(authGateway.confirmUser).toHaveBeenCalledTimes(1);
      expect(accountRepository.findByEmail).toHaveBeenCalledWith(pending.email);
      expect(accountRepository.register).toHaveBeenCalledWith(registered);
    });

    it("should return CodeInvalidError when the verification code is wrong", async () => {
      // Given
      const message = faker.lorem.sentence();
      const authGateway = createAuthGateway({
        confirmUser: vi.fn().mockReturnValue(errAsync({ kind: "CODE_INVALID", message })),
      });
      const accountRepository = createAccountRepository();
      const usecase = ConfirmSignUpUsecase({ accountRepository, authGateway });

      // When
      const pending = createPendingAccount();
      const result = await usecase.execute({
        code: faker.string.numeric(6),
        email: pending.email,
      });

      // Then
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toEqual({ kind: "CODE_INVALID", message });
      expect(accountRepository.findByEmail).not.toHaveBeenCalled();
      expect(accountRepository.register).not.toHaveBeenCalled();
    });

    it("should return AuthGatewayError when Cognito call fails for unknown reasons", async () => {
      // Given
      const message = faker.lorem.sentence();
      const authGateway = createAuthGateway({
        confirmUser: vi.fn().mockReturnValue(errAsync({ kind: "AUTH_GATEWAY", message })),
      });
      const accountRepository = createAccountRepository();
      const usecase = ConfirmSignUpUsecase({ accountRepository, authGateway });

      // When
      const pending = createPendingAccount();
      const result = await usecase.execute({
        code: faker.string.numeric(6),
        email: pending.email,
      });

      // Then
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toEqual({ kind: "AUTH_GATEWAY", message });
      expect(accountRepository.findByEmail).not.toHaveBeenCalled();
      expect(accountRepository.register).not.toHaveBeenCalled();
    });

    it("should self-heal the DB when Cognito reports already confirmed but DB is still PENDING", async () => {
      // Given
      const pending = createPendingAccount();
      const registered = { ...pending, status: AccountStatusEnum.REGISTERED };
      const authGateway = createAuthGateway({
        confirmUser: vi.fn().mockReturnValue(
          errAsync({
            kind: "AUTH_USER_ALREADY_CONFIRMED",
            message: faker.lorem.sentence(),
          }),
        ),
      });
      const accountRepository = createAccountRepository({
        findByEmail: vi.fn().mockReturnValue(okAsync(pending)),
        register: vi.fn().mockReturnValue(okAsync(registered)),
      });
      const usecase = ConfirmSignUpUsecase({ accountRepository, authGateway });

      // When
      const result = await usecase.execute({
        code: faker.string.numeric(6),
        email: pending.email,
      });

      // Then
      expect(result.isOk()).toBe(true);
      expect(accountRepository.register).toHaveBeenCalledWith(registered);
    });

    it("should be idempotent when both Cognito and DB report already confirmed / registered", async () => {
      // Given
      const registered = createRegisteredAccount();
      const authGateway = createAuthGateway({
        confirmUser: vi.fn().mockReturnValue(
          errAsync({
            kind: "AUTH_USER_ALREADY_CONFIRMED",
            message: faker.lorem.sentence(),
          }),
        ),
      });
      const accountRepository = createAccountRepository({
        findByEmail: vi.fn().mockReturnValue(okAsync(registered)),
      });
      const usecase = ConfirmSignUpUsecase({ accountRepository, authGateway });

      // When
      const result = await usecase.execute({
        code: faker.string.numeric(6),
        email: registered.email,
      });

      // Then
      expect(result.isOk()).toBe(true);
      expect(accountRepository.register).not.toHaveBeenCalled();
    });

    it("should return DatabaseError when the DB update fails after Cognito confirmation succeeds", async () => {
      // Given
      const pending = createPendingAccount();
      const message = faker.lorem.sentence();
      const authGateway = createAuthGateway({
        confirmUser: vi.fn().mockReturnValue(okAsync(undefined)),
      });
      const accountRepository = createAccountRepository({
        findByEmail: vi.fn().mockReturnValue(okAsync(pending)),
        register: vi.fn().mockReturnValue(errAsync({ kind: "DATABASE", message })),
      });
      const usecase = ConfirmSignUpUsecase({ accountRepository, authGateway });

      // When
      const result = await usecase.execute({
        code: faker.string.numeric(6),
        email: pending.email,
      });

      // Then
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toEqual({ kind: "DATABASE", message });
    });

    it("should return NotFoundError when the email has no matching DB row", async () => {
      // Given
      const pending = createPendingAccount();
      const message = faker.lorem.sentence();
      const authGateway = createAuthGateway({
        confirmUser: vi.fn().mockReturnValue(okAsync(undefined)),
      });
      const accountRepository = createAccountRepository({
        findByEmail: vi.fn().mockReturnValue(errAsync({ kind: "NOT_FOUND", message })),
      });
      const usecase = ConfirmSignUpUsecase({ accountRepository, authGateway });

      // When
      const result = await usecase.execute({
        code: faker.string.numeric(6),
        email: pending.email,
      });

      // Then
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toEqual({ kind: "NOT_FOUND", message });
      expect(accountRepository.register).not.toHaveBeenCalled();
    });
  });
});

function createAuthGateway(overwrites: Partial<AuthGateway> = {}): AuthGateway {
  const defaultGateway: AuthGateway = {
    confirmUser: vi.fn(),
    deleteBySub: vi.fn(),
    findByEmail: vi.fn(),
    signUp: vi.fn(),
  };

  return { ...defaultGateway, ...overwrites };
}

function createAccountRepository(overwrites: Partial<AccountRepository> = {}): AccountRepository {
  const defaultRepository: AccountRepository = {
    create: vi.fn(),
    deleteByCognitoSub: vi.fn(),
    findByCognitoSub: vi.fn(),
    findByEmail: vi.fn(),
    register: vi.fn(),
  };

  return { ...defaultRepository, ...overwrites };
}
