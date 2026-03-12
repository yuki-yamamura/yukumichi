import { Hono } from "hono";
import { PublicRouteId } from "@/domain/model/public-route/model";
import { UserId } from "@/domain/model/user/model";
import { getPublicRouteDetail } from "@/application/usecase/public-route/get-detail";
import { getPublicRouteDetailForUser } from "@/application/usecase/public-route/get-detail-for-user";
import { createPublicRouteRepository } from "@/infrastructure/repositories/public-route";

const app = new Hono();

const publicRouteRepository = createPublicRouteRepository();
const getDetail = getPublicRouteDetail({ publicRouteRepository });
const getDetailForUser = getPublicRouteDetailForUser({ publicRouteRepository });

export const publicRoutesRoute = app
  .get("/public-routes/:routeId", async (c) => {
    const routeId = PublicRouteId.parse(c.req.param("routeId"));
    const route = await getDetail(routeId);

    if (!route) {
      return c.json({ error: "Route not found" }, 404);
    }

    return c.json(route);
  })
  .get("/public-routes/:routeId/with-bookmark", async (c) => {
    const routeId = PublicRouteId.parse(c.req.param("routeId"));
    const userId = UserId.parse(c.req.query("userId"));

    const route = await getDetailForUser(routeId, userId);

    if (!route) {
      return c.json({ error: "Route not found" }, 404);
    }

    return c.json(route);
  });
