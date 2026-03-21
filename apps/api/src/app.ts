import { Hono } from "hono";
import { cors } from "hono/cors";

import { ListSpotsUsecase } from "@/application/usecase/spot/list";
import { createDatabase } from "@/infrastructure/database/client";
import { createSpotRoute } from "./presentation/routes/spot";
import { SpotRepository } from "./infrastructure/repositories/spot";
import { CreateSpotUsecase } from "./application/usecase/spot/create";
import { GetSpotUsecase } from "./application/usecase/spot/get";
import { ArchiveSpotUsecase } from "./application/usecase/spot/archive";

const db = createDatabase(process.env.DATABASE_URL!);
const spotRepository = SpotRepository(db);

const app = new Hono();
app.use(cors());

const routes = app.route(
  "/",
  createSpotRoute({
    createSpotUsecase: CreateSpotUsecase({ spotRepository }),
    listSpotsUsecase: ListSpotsUsecase({ spotRepository }),
    getSpotUsecase: GetSpotUsecase({ spotRepository }),
    archiveSpotUsecase: ArchiveSpotUsecase({ spotRepository }),
  }),
);

export type AppType = typeof routes;

export { routes as app };
