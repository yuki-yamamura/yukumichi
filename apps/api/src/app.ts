import { swaggerUI } from "@hono/swagger-ui";
import { errorResponseSchema } from "@sanpo/shared/error";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { openAPIRouteHandler, resolver } from "hono-openapi";

import { ArchiveSpotUsecase } from "@/application/usecase/spot/archive";
import { CreateSpotUsecase } from "@/application/usecase/spot/create";
import { GetSpotUsecase } from "@/application/usecase/spot/get";
import { ListSpotsUsecase } from "@/application/usecase/spot/list";
import { createDatabase } from "@/infrastructure/database/client";
import { SpotRepository } from "@/infrastructure/repositories/spot";
import { createSpotRoute } from "@/presentation/routes/spot";

import { UpdateSpotUsecase } from "./application/usecase/spot/update";

import type { Env } from "@/env";
import type { ApiError } from "@sanpo/shared/error";
import type { DescribeRouteOptions } from "hono-openapi";

export function createApp(env: Env) {
  const db = createDatabase(env);
  const spotRepository = SpotRepository(db);

  const _app = new Hono();
  _app.use(cors());

  _app.onError((error, context) => {
    /**
     * @todo Replace with structured logging
     * @see https://github.com/yuki-yamamura/sanpo/issues/35
     */
    console.error(error);

    return context.json<ApiError>(
      {
        code: "UNKNOWN_ERROR",
        message: "Internal server error",
      },
      500,
    );
  });

  const app = _app.route(
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
          "application/json": { schema: resolver(errorResponseSchema) },
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
          title: "Sanpo API",
          version: "0.2.0",
        },
      },
    }),
  );
  _app.get("/ui", swaggerUI({ url: "/doc" }));

  return app;
}

export type AppType = ReturnType<typeof createApp>;
