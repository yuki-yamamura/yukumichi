import { Hono } from "hono";
import { cors } from "hono/cors";

import { createGetPublicRouteDetailUsecase } from "@/application/usecase/public-route/get-detail";
import { createGetPublicRouteDetailForUserUsecase } from "@/application/usecase/public-route/get-detail-for-user";
import { createPublishPublicRouteUsecase } from "@/application/usecase/public-route/publish";
import { createSearchPublicRoutesUsecase } from "@/application/usecase/public-route/search";
import { createListSpotsByUserUsecase } from "@/application/usecase/spot/list-by-user";
import { createSearchSpotsUsecase } from "@/application/usecase/spot/search";
import { createDatabase } from "@/infrastructure/database/client";
import { createTransactionRunner } from "@/infrastructure/database/transaction-runner";
import { createRouteSearchQueryService } from "@/infrastructure/query-service/route-search";
import { createPublicRouteRepository } from "@/infrastructure/repositories/public-route";
import { createSpotRepository } from "@/infrastructure/repositories/spot";
import { helloRoute } from "./presentation/routes/hello";
import { createPublicRoutesRoute } from "./presentation/routes/public-routes";
import { createSpotsRoute } from "./presentation/routes/spots";
import { createDebugRoute } from "./presentation/routes/debug";

const db = createDatabase(process.env.DATABASE_URL!);
const transactionRunner = createTransactionRunner(db);
const routeSearchQueryService = createRouteSearchQueryService(db);
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
      searchSpotsUsecase: createSearchSpotsUsecase({ spotRepository }),
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
      publishPublicRouteUsecase: createPublishPublicRouteUsecase({
        transactionRunner,
      }),
      searchPublicRoutesUsecase: createSearchPublicRoutesUsecase({
        routeSearchQueryService,
      }),
    }),
  )
  .route("/", createDebugRoute(db));

type AppType = typeof route;

export default route;
export type { AppType };
