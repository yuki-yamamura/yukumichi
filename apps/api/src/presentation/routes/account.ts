import { Hono } from "hono";
import { describeRoute, resolver } from "hono-openapi";

import { toApiError, toHttpStatusCode } from "@/presentation/helpers/error";
import { zValidator } from "@/presentation/middlewares/zod-validator";
import {
  confirmSignUpRequestBodySchema,
  signUpRequestBodySchema,
} from "@/presentation/schemas/account";
import {
  accountAlreadyRegisteredErrorResponseSchema,
  authGatewayErrorResponseSchema,
  badRequestErrorResponseSchema,
  codeInvalidErrorResponseSchema,
  notFoundErrorResponseSchema,
} from "@/presentation/schemas/error";

import type { ConfirmSignUpUsecase } from "@/application/usecase/account/confirm-sign-up";
import type { SignUpUsecase } from "@/application/usecase/account/sign-up";

type AccountRouteDeps = {
  confirmSignUpUsecase: ConfirmSignUpUsecase;
  signUpUsecase: SignUpUsecase;
};

export function createAccountRoute({ confirmSignUpUsecase, signUpUsecase }: AccountRouteDeps) {
  return new Hono()
    .post(
      "/sign-up",
      describeRoute({
        description: "Start a sign-up flow with email and password",
        responses: {
          201: {
            description: "Sign-up accepted; verification email sent",
          },
          400: {
            content: {
              "application/json": { schema: resolver(badRequestErrorResponseSchema) },
            },
            description: "Validation error",
          },
          409: {
            content: {
              "application/json": {
                schema: resolver(accountAlreadyRegisteredErrorResponseSchema),
              },
            },
            description: "The email is already registered",
          },
          502: {
            content: {
              "application/json": { schema: resolver(authGatewayErrorResponseSchema) },
            },
            description: "The auth provider is unavailable",
          },
        },
        tags: ["accounts"],
      }),
      zValidator("json", signUpRequestBodySchema),
      async (context) => {
        const json = context.req.valid("json");
        const result = await signUpUsecase.execute(json);

        return result.match(
          () => context.body(null, 201),
          (error) => {
            const apiError = toApiError(error);

            return context.json(apiError, toHttpStatusCode(apiError.code));
          },
        );
      },
    )
    .post(
      "/sign-up/confirm",
      describeRoute({
        description: "Confirm sign-up with the verification code sent to the email",
        responses: {
          204: {
            description: "The account is now confirmed",
          },
          400: {
            content: {
              "application/json": {
                schema: resolver(badRequestErrorResponseSchema.or(codeInvalidErrorResponseSchema)),
              },
            },
            description: "Validation error or the verification code was invalid",
          },
          404: {
            content: {
              "application/json": { schema: resolver(notFoundErrorResponseSchema) },
            },
            description: "No account exists for the given email",
          },
          502: {
            content: {
              "application/json": { schema: resolver(authGatewayErrorResponseSchema) },
            },
            description: "The auth provider is unavailable",
          },
        },
        tags: ["accounts"],
      }),
      zValidator("json", confirmSignUpRequestBodySchema),
      async (context) => {
        const json = context.req.valid("json");
        const result = await confirmSignUpUsecase.execute(json);

        return result.match(
          () => context.body(null, 204),
          (error) => {
            const apiError = toApiError(error);

            return context.json(apiError, toHttpStatusCode(apiError.code));
          },
        );
      },
    );
}
