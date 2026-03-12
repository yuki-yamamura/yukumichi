import { z } from "zod";
import { UserId } from "@/domain/model/user/model";

export const SpotId = z.uuid().brand<"SpotId">();
export type SpotId = z.infer<typeof SpotId>;

export const Spot = z.object({
  id: SpotId,
  userId: UserId,
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Spot = z.infer<typeof Spot>;

export function createSpot(input: unknown): Spot {
  return Spot.parse(input);
}
