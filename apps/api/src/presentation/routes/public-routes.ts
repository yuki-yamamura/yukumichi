import { Hono } from "hono";
import { PublicRouteId } from "@/domain/model/public-route/model";
import { UserId } from "@/domain/model/user/model";
import type { GetPublicRouteDetailUsecase } from "@/application/usecase/public-route/get-detail";
import type { GetPublicRouteDetailForUserUsecase } from "@/application/usecase/public-route/get-detail-for-user";

type PublicRoutesDeps = {
  getPublicRouteDetailUsecase: GetPublicRouteDetailUsecase;
  getPublicRouteDetailForUserUsecase: GetPublicRouteDetailForUserUsecase;
};

export function createPublicRoutesRoute({
  getPublicRouteDetailUsecase,
  getPublicRouteDetailForUserUsecase,
}: PublicRoutesDeps) {
  const app = new Hono();

  return app
    .get("/public-routes/:routeId", async (c) => {
      const routeId = PublicRouteId.parse(c.req.param("routeId"));
      const route = await getPublicRouteDetailUsecase.execute(routeId);

      if (!route) {
        return c.json({ error: "Route not found" }, 404);
      }

      return c.json(route);
    })
    .get("/public-routes/:routeId/with-bookmark", async (c) => {
      const routeId = PublicRouteId.parse(c.req.param("routeId"));
      const userId = UserId.parse(c.req.query("userId"));

      const route = await getPublicRouteDetailForUserUsecase.execute(routeId, userId);

      if (!route) {
        return c.json({ error: "Route not found" }, 404);
      }

      return c.json(route);
    });
}
