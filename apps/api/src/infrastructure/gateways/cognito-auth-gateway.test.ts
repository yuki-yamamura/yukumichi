import {
  AdminDeleteUserCommand,
  AdminGetUserCommand,
  ConfirmSignUpCommand,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { faker } from "@faker-js/faker";

import { createEmail } from "@/test/fixtures/account";

import { CognitoAuthGateway } from "./cognito-auth-gateway";

const clientId = "test-client-id";
const userPoolId = "test-user-pool-id";

describe("CognitoAuthGateway", () => {
  describe("signUp", () => {
    it("should invoke SignUpCommand with the expected input and return the sub", async () => {
      // Given
      const sub = faker.string.uuid();
      const send = vi.fn().mockResolvedValue({ UserSub: sub });
      const gateway = CognitoAuthGateway({ client: { send }, clientId, userPoolId });
      const email = createEmail();
      const password = faker.internet.password({ length: 12 });

      // When
      const result = await gateway.signUp({ email, password });

      // Then
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(sub);
      expect(send).toHaveBeenCalledTimes(1);
      const [command] = send.mock.calls[0];
      if (!(command instanceof SignUpCommand)) throw new Error("Expected SignUpCommand");
      expect(command.input).toEqual({ ClientId: clientId, Password: password, Username: email });
    });

    it("should map UsernameExistsException to AUTH_USER_ALREADY_EXISTS", async () => {
      // Given
      const message = faker.lorem.sentence();
      const error = Object.assign(new Error(message), { name: "UsernameExistsException" });
      const send = vi.fn().mockRejectedValue(error);
      const gateway = CognitoAuthGateway({ client: { send }, clientId, userPoolId });

      // When
      const result = await gateway.signUp({
        email: createEmail(),
        password: faker.internet.password({ length: 12 }),
      });

      // Then
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toEqual({ kind: "AUTH_USER_ALREADY_EXISTS", message });
    });

    it("should fall back to AUTH_GATEWAY for unknown SDK errors", async () => {
      // Given
      const message = faker.lorem.sentence();
      const error = Object.assign(new Error(message), { name: "InternalErrorException" });
      const send = vi.fn().mockRejectedValue(error);
      const gateway = CognitoAuthGateway({ client: { send }, clientId, userPoolId });

      // When
      const result = await gateway.signUp({
        email: createEmail(),
        password: faker.internet.password({ length: 12 }),
      });

      // Then
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toEqual({ kind: "AUTH_GATEWAY", message });
    });
  });

  describe("confirmUser", () => {
    it("should invoke ConfirmSignUpCommand with the expected input", async () => {
      // Given
      const send = vi.fn().mockResolvedValue({});
      const gateway = CognitoAuthGateway({ client: { send }, clientId, userPoolId });
      const email = createEmail();
      const code = faker.string.numeric(6);

      // When
      const result = await gateway.confirmUser({ code, email });

      // Then
      expect(result.isOk()).toBe(true);
      expect(send).toHaveBeenCalledTimes(1);
      const [command] = send.mock.calls[0];
      if (!(command instanceof ConfirmSignUpCommand))
        throw new Error("Expected ConfirmSignUpCommand");
      expect(command.input).toEqual({
        ClientId: clientId,
        ConfirmationCode: code,
        Username: email,
      });
    });

    it.each([["CodeMismatchException"], ["ExpiredCodeException"]])(
      "should map %s to CODE_INVALID",
      async (name) => {
        // Given
        const message = faker.lorem.sentence();
        const error = Object.assign(new Error(message), { name });
        const send = vi.fn().mockRejectedValue(error);
        const gateway = CognitoAuthGateway({ client: { send }, clientId, userPoolId });

        // When
        const result = await gateway.confirmUser({
          code: faker.string.numeric(6),
          email: createEmail(),
        });

        // Then
        expect(result.isErr()).toBe(true);
        expect(result._unsafeUnwrapErr()).toEqual({ kind: "CODE_INVALID", message });
      },
    );

    it("should map NotAuthorizedException that mentions CONFIRMED to AUTH_USER_ALREADY_CONFIRMED", async () => {
      // Given
      const message = "User cannot be confirmed. Current status is CONFIRMED";
      const error = Object.assign(new Error(message), { name: "NotAuthorizedException" });
      const send = vi.fn().mockRejectedValue(error);
      const gateway = CognitoAuthGateway({ client: { send }, clientId, userPoolId });

      // When
      const result = await gateway.confirmUser({
        code: faker.string.numeric(6),
        email: createEmail(),
      });

      // Then
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toEqual({
        kind: "AUTH_USER_ALREADY_CONFIRMED",
        message,
      });
    });

    it("should map unrelated NotAuthorizedException to AUTH_GATEWAY", async () => {
      // Given
      const message = "Password attempts exceeded";
      const error = Object.assign(new Error(message), { name: "NotAuthorizedException" });
      const send = vi.fn().mockRejectedValue(error);
      const gateway = CognitoAuthGateway({ client: { send }, clientId, userPoolId });

      // When
      const result = await gateway.confirmUser({
        code: faker.string.numeric(6),
        email: createEmail(),
      });

      // Then
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toEqual({ kind: "AUTH_GATEWAY", message });
    });
  });

  describe("findByEmail", () => {
    it.each([
      ["CONFIRMED", "confirmed"],
      ["UNCONFIRMED", "unconfirmed"],
      ["ARCHIVED", "other"],
    ])("should return sub and map UserStatus %s to %s", async (cognitoStatus, domainStatus) => {
      // Given
      const sub = faker.string.uuid();
      const send = vi.fn().mockResolvedValue({
        UserAttributes: [
          { Name: "sub", Value: sub },
          { Name: "email", Value: "someone@example.com" },
        ],
        UserStatus: cognitoStatus,
      });
      const gateway = CognitoAuthGateway({ client: { send }, clientId, userPoolId });
      const email = createEmail();

      // When
      const result = await gateway.findByEmail(email);

      // Then
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual({ status: domainStatus, sub });
      const [command] = send.mock.calls[0];
      if (!(command instanceof AdminGetUserCommand))
        throw new Error("Expected AdminGetUserCommand");
      expect(command.input).toEqual({ Username: email, UserPoolId: userPoolId });
    });

    it("should map UserNotFoundException to AUTH_USER_NOT_FOUND", async () => {
      // Given
      const message = faker.lorem.sentence();
      const error = Object.assign(new Error(message), { name: "UserNotFoundException" });
      const send = vi.fn().mockRejectedValue(error);
      const gateway = CognitoAuthGateway({ client: { send }, clientId, userPoolId });

      // When
      const result = await gateway.findByEmail(createEmail());

      // Then
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toEqual({ kind: "AUTH_USER_NOT_FOUND", message });
    });
  });

  describe("deleteBySub", () => {
    it("should invoke AdminDeleteUserCommand with the sub as Username", async () => {
      // Given
      const send = vi.fn().mockResolvedValue({});
      const gateway = CognitoAuthGateway({ client: { send }, clientId, userPoolId });
      const sub = faker.string.uuid();

      // When
      const result = await gateway.deleteBySub(sub);

      // Then
      expect(result.isOk()).toBe(true);
      const [command] = send.mock.calls[0];
      if (!(command instanceof AdminDeleteUserCommand))
        throw new Error("Expected AdminDeleteUserCommand");
      expect(command.input).toEqual({ Username: sub, UserPoolId: userPoolId });
    });

    it("should map SDK errors to AUTH_GATEWAY", async () => {
      // Given
      const message = faker.lorem.sentence();
      const error = Object.assign(new Error(message), { name: "InternalErrorException" });
      const send = vi.fn().mockRejectedValue(error);
      const gateway = CognitoAuthGateway({ client: { send }, clientId, userPoolId });

      // When
      const result = await gateway.deleteBySub(faker.string.uuid());

      // Then
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toEqual({ kind: "AUTH_GATEWAY", message });
    });
  });
});
