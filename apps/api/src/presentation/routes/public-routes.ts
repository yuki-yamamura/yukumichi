import { Hono } from "hono";
import { GetPublicRouteWithBookmarkUseCase } from "@/application/usecase/public-route/get-with-bookmark";
import { GetPublicRouteWithSpotsUseCase } from "@/application/usecase/public-route/get-with-spots";
import { DrizzlePublicRouteRepository } from "@/infrastructure/repositories/public-route";

const app = new Hono();

const publicRouteRepository = new DrizzlePublicRouteRepository();
const getWithSpots = new GetPublicRouteWithSpotsUseCase(publicRouteRepository);
const getWithBookmark = new GetPublicRouteWithBookmarkUseCase(
  publicRouteRepository,
);

export const publicRoutesRoute = app
  .get("/public-routes/:routeId", async (c) => {
    const routeId = c.req.param("routeId");
    const route = await getWithSpots.execute(routeId);

    if (!route) {
      return c.json({ error: "Route not found" }, 404);
    }

    return c.json(route);
  })
  .get("/public-routes/:routeId/with-bookmark", async (c) => {
    const routeId = c.req.param("routeId");
    const userId = c.req.query("userId");

    if (!userId) {
      return c.json({ error: "userId query parameter is required" }, 400);
    }

    const route = await getWithBookmark.execute(routeId, userId);

    if (!route) {
      return c.json({ error: "Route not found" }, 404);
    }

    return c.json(route);
  });
