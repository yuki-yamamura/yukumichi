import { Hono } from "hono";
import { UserId } from "@/domain/model/user/model";
import type { ListSpotsByUserUsecase } from "@/application/usecase/spot/list-by-user";

type SpotsRouteDeps = {
  listSpotsByUserUsecase: ListSpotsByUserUsecase;
};

export function createSpotsRoute({ listSpotsByUserUsecase }: SpotsRouteDeps) {
  const app = new Hono();

  return app.get("/users/:userId/spots", async (c) => {
    const userId = UserId.parse(c.req.param("userId"));
    const spots = await listSpotsByUserUsecase.execute(userId);

    return c.json(spots);
  });
}
