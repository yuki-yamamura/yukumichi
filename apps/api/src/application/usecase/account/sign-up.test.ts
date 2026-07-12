import { faker } from "@faker-js/faker";
import { errAsync, okAsync } from "neverthrow";

import { createEmail, createPendingAccount } from "@/test/fixtures/account";

import { SignUpUsecase } from "./sign-up";

import type { AuthGateway } from "@/domain/account/auth-gateway";
import type { AccountRepository } from "@/domain/account/repository";

describe("SignUpUsecase", () => {
  describe("execute", () => {
    it("should register a pending account when Cognito sign-up and DB insert both succeed", async () => {
      // Given
      const account = createPendingAccount();
      const authGateway = createAuthGateway({
        signUp: vi.fn().mockReturnValue(okAsync(account.cognitoSub)),
      });
      const accountRepository = createAccountRepository({
        create: vi.fn().mockReturnValue(okAsync(account.id)),
      });
      const usecase = SignUpUsecase({ accountRepository, authGateway });

      // When
      const result = await usecase.execute({
        email: account.email,
        password: faker.internet.password(),
      });

      // Then
      expect(result.isOk()).toBe(true);
      expect(authGateway.signUp).toHaveBeenCalledTimes(1);
      expect(accountRepository.create).toHaveBeenCalledTimes(1);
      expect(authGateway.deleteBySub).not.toHaveBeenCalled();
    });

    it("should return AccountAlreadyRegisteredError when Cognito reports the user already exists", async () => {
      // Given
      const message = faker.lorem.sentence();
      const authGateway = createAuthGateway({
        signUp: vi.fn().mockReturnValue(errAsync({ kind: "AUTH_USER_ALREADY_EXISTS", message })),
      });
      const accountRepository = createAccountRepository();
      const usecase = SignUpUsecase({ accountRepository, authGateway });

      // When
      const result = await usecase.execute({
        email: createEmail(),
        password: faker.internet.password(),
      });

      // Then
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toEqual({
        kind: "ACCOUNT_ALREADY_REGISTERED",
        message,
      });
      expect(accountRepository.create).not.toHaveBeenCalled();
      expect(authGateway.deleteBySub).not.toHaveBeenCalled();
    });

    it("should return AuthGatewayError when Cognito call fails for unknown reasons", async () => {
      // Given
      const message = faker.lorem.sentence();
      const authGateway = createAuthGateway({
        signUp: vi.fn().mockReturnValue(errAsync({ kind: "AUTH_GATEWAY", message })),
      });
      const accountRepository = createAccountRepository();
      const usecase = SignUpUsecase({ accountRepository, authGateway });

      // When
      const result = await usecase.execute({
        email: createEmail(),
        password: faker.internet.password(),
      });

      // Then
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toEqual({ kind: "AUTH_GATEWAY", message });
      expect(accountRepository.create).not.toHaveBeenCalled();
      expect(authGateway.deleteBySub).not.toHaveBeenCalled();
    });

    it("should compensate by deleting the Cognito user when DB insert fails", async () => {
      // Given
      const sub = faker.string.uuid();
      const dbMessage = faker.lorem.sentence();
      const authGateway = createAuthGateway({
        deleteBySub: vi.fn().mockReturnValue(okAsync(undefined)),
        signUp: vi.fn().mockReturnValue(okAsync(sub)),
      });
      const accountRepository = createAccountRepository({
        create: vi.fn().mockReturnValue(errAsync({ kind: "DATABASE", message: dbMessage })),
      });
      const usecase = SignUpUsecase({ accountRepository, authGateway });

      // When
      const result = await usecase.execute({
        email: createEmail(),
        password: faker.internet.password(),
      });

      // Then
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toEqual({ kind: "DATABASE", message: dbMessage });
      expect(authGateway.deleteBySub).toHaveBeenCalledWith(sub);
    });

    it("should still return the original DB error when compensation also fails", async () => {
      // Given
      const sub = faker.string.uuid();
      const dbMessage = faker.lorem.sentence();
      const authGateway = createAuthGateway({
        deleteBySub: vi
          .fn()
          .mockReturnValue(errAsync({ kind: "AUTH_GATEWAY", message: "compensation failed" })),
        signUp: vi.fn().mockReturnValue(okAsync(sub)),
      });
      const accountRepository = createAccountRepository({
        create: vi.fn().mockReturnValue(errAsync({ kind: "DATABASE", message: dbMessage })),
      });
      const usecase = SignUpUsecase({ accountRepository, authGateway });

      // When
      const result = await usecase.execute({
        email: createEmail(),
        password: faker.internet.password(),
      });

      // Then — the caller must see the DB failure that triggered the compensation,
      // not the compensation failure itself.
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toEqual({ kind: "DATABASE", message: dbMessage });
      expect(authGateway.deleteBySub).toHaveBeenCalledWith(sub);
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
