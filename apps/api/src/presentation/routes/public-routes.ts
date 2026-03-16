import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { PublicRouteId } from "@/domain/model/public-route/model";
import { SpotId } from "@/domain/model/spot/model";
import { UserId } from "@/domain/model/user/model";
import type { GetPublicRouteDetailUsecase } from "@/application/usecase/public-route/get-detail";
import type { GetPublicRouteDetailForUserUsecase } from "@/application/usecase/public-route/get-detail-for-user";
import type { PublishPublicRouteUsecase } from "@/application/usecase/public-route/publish";
import type { SearchPublicRoutesUsecase } from "@/application/usecase/public-route/search";

type PublicRoutesDeps = {
  getPublicRouteDetailUsecase: GetPublicRouteDetailUsecase;
  getPublicRouteDetailForUserUsecase: GetPublicRouteDetailForUserUsecase;
  publishPublicRouteUsecase: PublishPublicRouteUsecase;
  searchPublicRoutesUsecase: SearchPublicRoutesUsecase;
};

const routeSearchQuerySchema = z.object({
  keyword: z.string().optional(),
  minSpotCount: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().default(20),
  offset: z.coerce.number().int().nonnegative().default(0),
});

const publishBodySchema = z.object({
  userId: UserId,
  title: z.string().min(1),
  description: z.string().nullable(),
  spots: z
    .array(
      z.object({
        id: SpotId,
        name: z.string().min(1),
        latitude: z.number(),
        longitude: z.number(),
      }),
    )
    .min(1),
});

export function createPublicRoutesRoute({
  getPublicRouteDetailUsecase,
  getPublicRouteDetailForUserUsecase,
  publishPublicRouteUsecase,
  searchPublicRoutesUsecase,
}: PublicRoutesDeps) {
  const app = new Hono();

  return app
    .get(
      "/public-routes/search",
      zValidator("query", routeSearchQuerySchema),
      async (c) => {
        const params = c.req.valid("query");
        const results = await searchPublicRoutesUsecase.execute(params);

        return c.json(results);
      },
    )
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
    )
    .post(
      "/public-routes",
      zValidator("json", publishBodySchema),
      async (c) => {
        const body = c.req.valid("json");
        const routeId = crypto.randomUUID() as z.infer<typeof PublicRouteId>;

        const route = await publishPublicRouteUsecase.execute({
          routeId,
          userId: body.userId,
          title: body.title,
          description: body.description,
          spots: body.spots,
        });

        return c.json(route, 201);
      },
    );
}
