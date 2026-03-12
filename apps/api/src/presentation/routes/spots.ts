import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { UserId } from "@/domain/model/user/model";
import type { ListSpotsByUserUsecase } from "@/application/usecase/spot/list-by-user";

type SpotsRouteDeps = {
  listSpotsByUserUsecase: ListSpotsByUserUsecase;
};

export function createSpotsRoute({ listSpotsByUserUsecase }: SpotsRouteDeps) {
  const app = new Hono();

  return app.get(
    "/users/:userId/spots",
    zValidator("param", z.object({ userId: UserId })),
    async (c) => {
      const { userId } = c.req.valid("param");
      const spots = await listSpotsByUserUsecase.execute(userId);

      return c.json(spots);
    },
  );
}
