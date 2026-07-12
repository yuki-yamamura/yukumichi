import {
  AdminDeleteUserCommand,
  AdminGetUserCommand,
  ConfirmSignUpCommand,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { ResultAsync } from "neverthrow";

import type {
  AuthGateway,
  AuthGatewayError,
  AuthUserAlreadyConfirmedError,
  AuthUserAlreadyExistsError,
  AuthUserNotFoundError,
  AuthUserStatus,
  CodeInvalidError,
} from "@/domain/account/auth-gateway";
import type { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";

type CognitoAuthGatewayDeps = {
  client: Pick<CognitoIdentityProviderClient, "send">;
  clientId: string;
  userPoolId: string;
};

export function CognitoAuthGateway({
  client,
  clientId,
  userPoolId,
}: CognitoAuthGatewayDeps): AuthGateway {
  return {
    confirmUser: ({ code, email }) =>
      ResultAsync.fromPromise(
        client.send(
          new ConfirmSignUpCommand({
            ClientId: clientId,
            ConfirmationCode: code,
            Username: email,
          }),
        ),
        mapConfirmSignUpError,
      ).map(() => {}),

    deleteBySub: (sub) =>
      ResultAsync.fromPromise(
        client.send(new AdminDeleteUserCommand({ Username: sub, UserPoolId: userPoolId })),
        toAuthGatewayError,
      ).map(() => {}),

    findByEmail: (email) =>
      ResultAsync.fromPromise(
        client.send(new AdminGetUserCommand({ Username: email, UserPoolId: userPoolId })),
        mapAdminGetUserError,
      ).map((response) => ({
        status: toAuthUserStatus(response.UserStatus),
        sub: extractSub(response.UserAttributes),
      })),

    signUp: ({ email, password }) =>
      ResultAsync.fromPromise(
        client.send(new SignUpCommand({ ClientId: clientId, Password: password, Username: email })),
        mapSignUpError,
      ).map((response) => response.UserSub ?? ""),
  };
}

function mapSignUpError(error: unknown): AuthGatewayError | AuthUserAlreadyExistsError {
  if (isNamedError(error, "UsernameExistsException")) {
    return { kind: "AUTH_USER_ALREADY_EXISTS", message: error.message };
  }

  return toAuthGatewayError(error);
}

function mapConfirmSignUpError(
  error: unknown,
): AuthGatewayError | AuthUserAlreadyConfirmedError | CodeInvalidError {
  if (isNamedError(error, "CodeMismatchException") || isNamedError(error, "ExpiredCodeException")) {
    return { kind: "CODE_INVALID", message: error.message };
  }

  // Cognito surfaces "already confirmed" as NotAuthorizedException with a message
  // like "User cannot be confirmed. Current status is CONFIRMED". Detect by the
  // exception name AND the status keyword in the message so unrelated
  // NotAuthorizedException failures still fall through to AUTH_GATEWAY.
  if (isNamedError(error, "NotAuthorizedException") && /CONFIRMED/.test(error.message)) {
    return { kind: "AUTH_USER_ALREADY_CONFIRMED", message: error.message };
  }

  return toAuthGatewayError(error);
}

function mapAdminGetUserError(error: unknown): AuthGatewayError | AuthUserNotFoundError {
  if (isNamedError(error, "UserNotFoundException")) {
    return { kind: "AUTH_USER_NOT_FOUND", message: error.message };
  }

  return toAuthGatewayError(error);
}

function toAuthGatewayError(error: unknown): AuthGatewayError {
  return {
    kind: "AUTH_GATEWAY",
    message: error instanceof Error ? error.message : String(error),
  };
}

function isNamedError(error: unknown, name: string): error is Error {
  return error instanceof Error && error.name === name;
}

function toAuthUserStatus(status: string | undefined): AuthUserStatus {
  if (status === "CONFIRMED") return "confirmed";
  if (status === "UNCONFIRMED") return "unconfirmed";

  return "other";
}

function extractSub(attributes: { Name?: string; Value?: string }[] | undefined): string {
  return attributes?.find((attribute) => attribute.Name === "sub")?.Value ?? "";
}
