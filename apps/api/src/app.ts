import { Hono } from "hono";
import { cors } from "hono/cors";

import { createGetPublicRouteDetailUsecase } from "@/application/usecase/public-route/get-detail";
import { createGetPublicRouteDetailForUserUsecase } from "@/application/usecase/public-route/get-detail-for-user";
import { createListSpotsByUserUsecase } from "@/application/usecase/spot/list-by-user";
import { createDatabase } from "@/infrastructure/database/client";
import { createPublicRouteRepository } from "@/infrastructure/repositories/public-route";
import { createSpotRepository } from "@/infrastructure/repositories/spot";
import { helloRoute } from "./presentation/routes/hello";
import { createPublicRoutesRoute } from "./presentation/routes/public-routes";
import { createSpotsRoute } from "./presentation/routes/spots";

const db = createDatabase(process.env.DATABASE_URL!);
const publicRouteRepository = createPublicRouteRepository(db);
const spotRepository = createSpotRepository(db);

const app = new Hono();
app.use(cors());

const route = app
  .get("/", (c) => {
    return c.json({ message: "Hello, Hono!" });
  })
  .route("/", helloRoute)
  .route(
    "/",
    createSpotsRoute({
      listSpotsByUserUsecase: createListSpotsByUserUsecase({ spotRepository }),
    }),
  )
  .route(
    "/",
    createPublicRoutesRoute({
      getPublicRouteDetailUsecase: createGetPublicRouteDetailUsecase({
        publicRouteRepository,
      }),
      getPublicRouteDetailForUserUsecase: createGetPublicRouteDetailForUserUsecase({
        publicRouteRepository,
      }),
    }),
  );

type AppType = typeof route;

export default route;
export type { AppType };
