import { Hono } from "hono";
import { UserId } from "@/domain/model/user/model";
import { createListSpotsByUserUsecase } from "@/application/usecase/spot/list-by-user";
import { createSpotRepository } from "@/infrastructure/repositories/spot";

const app = new Hono();

const spotRepository = createSpotRepository();
const listSpotsByUserUsecase = createListSpotsByUserUsecase({ spotRepository });

export const spotsRoute = app.get("/users/:userId/spots", async (c) => {
  const userId = UserId.parse(c.req.param("userId"));
  const spots = await listSpotsByUserUsecase.execute(userId);

  return c.json(spots);
});
