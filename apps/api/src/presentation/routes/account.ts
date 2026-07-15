import { Hono } from "hono";
import { describeRoute, resolver } from "hono-openapi";

import { toApiError, toHttpStatusCode } from "@/presentation/helpers/error";
import { accountResponseSchema } from "@/presentation/schemas/account";
import { unauthorizedErrorResponseSchema } from "@/presentation/schemas/error";

import type { GetOrCreateAccountUsecase } from "@/application/usecase/account/get-or-create-account";
import type { JwtVerifierMiddleware } from "@/presentation/middlewares/jwt-verifier";

type AccountRouteDeps = {
  getOrCreateAccountUsecase: GetOrCreateAccountUsecase;
  jwtVerifier: JwtVerifierMiddleware;
};

export function createAccountRoute({ getOrCreateAccountUsecase, jwtVerifier }: AccountRouteDeps) {
  return new Hono().get(
    "/me",
    describeRoute({
      description: "Return the current account, creating it on first authenticated access (JIT)",
      responses: {
        200: {
          content: {
            "application/json": { schema: resolver(accountResponseSchema) },
          },
          description: "The account for the authenticated user",
        },
        401: {
          content: {
            "application/json": { schema: resolver(unauthorizedErrorResponseSchema) },
          },
          description: "Missing or invalid bearer token",
        },
      },
      tags: ["accounts"],
    }),
    jwtVerifier,
    async (context) => {
      const idToken = context.var.idToken;
      const result = await getOrCreateAccountUsecase.execute({
        cognitoSub: idToken.sub,
        email: typeof idToken.email === "string" ? idToken.email : "",
      });

      return result.match(
        (account) =>
          context.json(
            accountResponseSchema.parse({
              account: { email: account.email, id: account.id },
            }),
          ),
        (error) => {
          const apiError = toApiError(error);

          return context.json(apiError, toHttpStatusCode(apiError.code));
        },
      );
    },
  );
}
