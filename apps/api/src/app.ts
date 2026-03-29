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

type AppDeps = {
  databaseUrl: string;
};

export function createApp({ databaseUrl }: AppDeps) {
  const db = createDatabase(databaseUrl);
  const spotRepository = SpotRepository(db);

  const app = new Hono();
  app.use(cors());

  const apiApp = app.route(
    "/",
    createSpotRoute({
      createSpotUsecase: CreateSpotUsecase({ spotRepository }),
      listSpotsUsecase: ListSpotsUsecase({ spotRepository }),
      getSpotUsecase: GetSpotUsecase({ spotRepository }),
      archiveSpotUsecase: ArchiveSpotUsecase({ spotRepository }),
    }),
  );

  app.get(
    "/doc",
    openAPIRouteHandler(app, {
      documentation: {
        info: {
          title: "Sanpo API",
          version: "0.1.0",
        },
      },
    }),
  );
  app.get("/ui", swaggerUI({ url: "/doc" }));

  return apiApp;
}

export type AppType = ReturnType<typeof createApp>;
