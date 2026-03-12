import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
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
    .get(
      "/public-routes/:routeId",
      zValidator("param", z.object({ routeId: PublicRouteId })),
      async (c) => {
        const { routeId } = c.req.valid("param");
        const route = await getPublicRouteDetailUsecase.execute(routeId);

        if (!route) {
          return c.json({ error: "Route not found" }, 404);
        }

        return c.json(route);
      },
    )
    .get(
      "/public-routes/:routeId/with-bookmark",
      zValidator("param", z.object({ routeId: PublicRouteId })),
      zValidator("query", z.object({ userId: UserId })),
      async (c) => {
        const { routeId } = c.req.valid("param");
        const { userId } = c.req.valid("query");

        const route = await getPublicRouteDetailForUserUsecase.execute(routeId, userId);

        if (!route) {
          return c.json({ error: "Route not found" }, 404);
        }

        return c.json(route);
      },
    );
}
