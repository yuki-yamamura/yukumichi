import { createMiddleware } from "hono/factory";

import { toApiError } from "@/presentation/helpers/error";

import type { CognitoIdTokenPayload } from "aws-jwt-verify/jwt-model";

type IdTokenVerifier = {
  verifySync: (token: string) => CognitoIdTokenPayload;
};

type AuthContext = {
  Variables: {
    idToken: CognitoIdTokenPayload;
  };
};

export type JwtVerifierMiddleware = ReturnType<typeof jwtVerifier>;

export function jwtVerifier(verifier: IdTokenVerifier) {
  return createMiddleware<AuthContext>(async (context, next) => {
    const header = context.req.header("Authorization");
    const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : undefined;

    if (!token) {
      return context.json(
        toApiError({ kind: "UNAUTHORIZED", message: "Missing bearer token" }),
        401,
      );
    }

    try {
      const payload = verifier.verifySync(token);
      context.set("idToken", payload);
      await next();

      return;
    } catch (error) {
      return context.json(
        toApiError({
          kind: "UNAUTHORIZED",
          message: error instanceof Error ? error.message : "Invalid token",
        }),
        401,
      );
    }
  });
}
