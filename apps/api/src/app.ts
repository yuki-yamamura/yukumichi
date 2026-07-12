import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { swaggerUI } from "@hono/swagger-ui";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { openAPIRouteHandler, resolver } from "hono-openapi";

import { ConfirmSignUpUsecase } from "@/application/usecase/account/confirm-sign-up";
import { SignUpUsecase } from "@/application/usecase/account/sign-up";
import { ArchiveSpotUsecase } from "@/application/usecase/spot/archive";
import { CreateSpotUsecase } from "@/application/usecase/spot/create";
import { GetSpotUsecase } from "@/application/usecase/spot/get";
import { ListSpotsUsecase } from "@/application/usecase/spot/list";
import { createDatabase } from "@/infrastructure/database/client";
import { CognitoAuthGateway } from "@/infrastructure/gateways/cognito-auth-gateway";
import { AccountRepository } from "@/infrastructure/repositories/account";
import { SpotRepository } from "@/infrastructure/repositories/spot";
import { createAccountRoute } from "@/presentation/routes/account";
import { createSpotRoute } from "@/presentation/routes/spot";

import { UpdateSpotUsecase } from "./application/usecase/spot/update";
import { toApiError } from "./presentation/helpers/error";
import { unknownErrorResponseSchema } from "./presentation/schemas/error";

import type { Env } from "@/env/server";
import type { DescribeRouteOptions } from "hono-openapi";

export function createApp(env: Env) {
  const db = createDatabase({ appEnv: env.APP_ENV, url: env.DATABASE_URL });
  const accountRepository = AccountRepository(db);
  const spotRepository = SpotRepository(db);

  const cognitoClient = new CognitoIdentityProviderClient({ region: env.AWS_REGION });
  const authGateway = CognitoAuthGateway({
    client: cognitoClient,
    clientId: env.COGNITO_CLIENT_ID,
    userPoolId: env.COGNITO_USER_POOL_ID,
  });

  const _app = new Hono();
  _app.use(cors());

  _app.onError((error, context) => {
    /**
     * @todo Replace with structured logging
     * @see https://github.com/yuki-yamamura/yukumichi/issues/35
     */
    console.error(error);

    return context.json(
      toApiError({
        kind: "UNKNOWN",
        message: "Internal server error",
      }),
      500,
    );
  });

  const app = _app
    .route(
      "/accounts",
      createAccountRoute({
        confirmSignUpUsecase: ConfirmSignUpUsecase({ accountRepository, authGateway }),
        signUpUsecase: SignUpUsecase({ accountRepository, authGateway }),
      }),
    )
    .route(
      "/spots",
      createSpotRoute({
        archiveSpotUsecase: ArchiveSpotUsecase({ spotRepository }),
        createSpotUsecase: CreateSpotUsecase({ spotRepository }),
        getSpotUsecase: GetSpotUsecase({ spotRepository }),
        listSpotsUsecase: ListSpotsUsecase({ spotRepository }),
        updateSpotUsecase: UpdateSpotUsecase({ spotRepository }),
      }),
    );

  const describeRouteOptions: DescribeRouteOptions = {
    responses: {
      500: {
        content: {
          "application/json": { schema: resolver(unknownErrorResponseSchema) },
        },
        description: "Internal server error",
      },
    },
  };
  _app.get(
    "/doc",
    openAPIRouteHandler(_app, {
      defaultOptions: {
        DELETE: describeRouteOptions,
        GET: describeRouteOptions,
        PATCH: describeRouteOptions,
        POST: describeRouteOptions,
        PUT: describeRouteOptions,
      },
      documentation: {
        info: {
          title: "Yukumichi API",
          version: "0.2.0",
        },
      },
    }),
  );
  _app.get("/ui", swaggerUI({ url: "/doc" }));

  return app;
}

export type AppType = ReturnType<typeof createApp>;
