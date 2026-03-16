import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { UserId } from "@/domain/model/user/model";
import type { ListSpotsByUserUsecase } from "@/application/usecase/spot/list-by-user";
import type { SearchSpotsUsecase } from "@/application/usecase/spot/search";

type SpotsRouteDeps = {
  listSpotsByUserUsecase: ListSpotsByUserUsecase;
  searchSpotsUsecase: SearchSpotsUsecase;
};

const searchQuerySchema = z.object({
  userId: UserId,
  name: z.string().optional(),
  minLatitude: z.coerce.number().optional(),
  maxLatitude: z.coerce.number().optional(),
  minLongitude: z.coerce.number().optional(),
  maxLongitude: z.coerce.number().optional(),
});

export function createSpotsRoute({
  listSpotsByUserUsecase,
  searchSpotsUsecase,
}: SpotsRouteDeps) {
  const app = new Hono();

  return app
    .get(
      "/users/:userId/spots",
      zValidator("param", z.object({ userId: UserId })),
      async (c) => {
        const { userId } = c.req.valid("param");
        const spots = await listSpotsByUserUsecase.execute(userId);

        return c.json(spots);
      },
    )
    .get(
      "/spots/search",
      zValidator("query", searchQuerySchema),
      async (c) => {
        const query = c.req.valid("query");

        const spots = await searchSpotsUsecase.execute({
          userId: query.userId,
          name: query.name,
          latitudeRange:
            query.minLatitude !== undefined && query.maxLatitude !== undefined
              ? { min: query.minLatitude, max: query.maxLatitude }
              : undefined,
          longitudeRange:
            query.minLongitude !== undefined && query.maxLongitude !== undefined
              ? { min: query.minLongitude, max: query.maxLongitude }
              : undefined,
        });

        return c.json(spots);
      },
    );
}
