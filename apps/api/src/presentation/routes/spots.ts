import { Hono } from "hono";
import { ListSpotsByUserUseCase } from "@/application/usecase/spot/list-by-user";
import { DrizzleSpotRepository } from "@/infrastructure/repositories/spot";

const app = new Hono();

const spotRepository = new DrizzleSpotRepository();
const listSpotsByUser = new ListSpotsByUserUseCase(spotRepository);

export const spotsRoute = app.get("/users/:userId/spots", async (c) => {
  const userId = c.req.param("userId");
  const spots = await listSpotsByUser.execute(userId);

  return c.json(spots);
});
