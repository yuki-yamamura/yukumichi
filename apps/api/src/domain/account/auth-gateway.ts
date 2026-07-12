import type { Email } from "@/domain/email";
import type { ResultAsync } from "neverthrow";

export type AuthUserStatus = "confirmed" | "other" | "unconfirmed";

export type AuthGatewayError = { kind: "AUTH_GATEWAY"; message: string };

export type AuthUserAlreadyExistsError = {
  kind: "AUTH_USER_ALREADY_EXISTS";
  message: string;
};

export type AuthUserNotFoundError = {
  kind: "AUTH_USER_NOT_FOUND";
  message: string;
};

export type AuthUserAlreadyConfirmedError = {
  kind: "AUTH_USER_ALREADY_CONFIRMED";
  message: string;
};

export type CodeInvalidError = {
  kind: "CODE_INVALID";
  message: string;
};

export type AuthGateway = {
  confirmUser: ({
    code,
    email,
  }: {
    code: string;
    email: Email;
  }) => ResultAsync<void, AuthGatewayError | AuthUserAlreadyConfirmedError | CodeInvalidError>;
  deleteBySub: (sub: string) => ResultAsync<void, AuthGatewayError>;
  findByEmail: (
    email: Email,
  ) => ResultAsync<
    { status: AuthUserStatus; sub: string },
    AuthGatewayError | AuthUserNotFoundError
  >;
  signUp: ({
    email,
    password,
  }: {
    email: Email;
    password: string;
  }) => ResultAsync<string, AuthGatewayError | AuthUserAlreadyExistsError>;
};
