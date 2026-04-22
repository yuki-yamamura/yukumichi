import { swaggerUI } from "@hono/swagger-ui";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { openAPIRouteHandler } from "hono-openapi";

import { ArchiveSpotUsecase } from "@/application/usecase/spot/archive";
import { CreateSpotUsecase } from "@/application/usecase/spot/create";
import { GetSpotUsecase } from "@/application/usecase/spot/get";
import { ListSpotsUsecase } from "@/application/usecase/spot/list";
import { createDatabase } from "@/infrastructure/database/client";
import { SpotRepository } from "@/infrastructure/repositories/spot";
import { createSpotRoute } from "@/presentation/routes/spot";

import type { ApiError } from "@/presentation/schemas/error";

type AppDeps = {
  databaseUrl: string;
};

export function createApp({ databaseUrl }: AppDeps) {
  const db = createDatabase(databaseUrl);
  const spotRepository = SpotRepository(db);

  const app = new Hono();
  app.use(cors());
  app.onError((error, c) => {
    // TODO: replace with structured logger and Sentry integration
    console.error(error);

    return c.json(
      { code: "UNKNOWN_ERROR", message: "internal server error" } satisfies ApiError,
      500,
    );
  });

  const apiApp = app.route(
    "/",
    createSpotRoute({
      archiveSpotUsecase: ArchiveSpotUsecase({ spotRepository }),
      createSpotUsecase: CreateSpotUsecase({ spotRepository }),
      getSpotUsecase: GetSpotUsecase({ spotRepository }),
      listSpotsUsecase: ListSpotsUsecase({ spotRepository }),
    }),
  );

  app.get(
    "/doc",
    openAPIRouteHandler(app, {
      documentation: {
        info: {
          title: "Sanpo API",
          version: "0.2.0",
        },
      },
    }),
  );
  app.get("/ui", swaggerUI({ url: "/doc" }));

  return apiApp;
}

export type AppType = ReturnType<typeof createApp>;
