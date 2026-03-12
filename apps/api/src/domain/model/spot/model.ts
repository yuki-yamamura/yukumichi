import { z } from "zod";
import type { UserId } from "@/domain/model/user/model";

export const SpotId = z.guid().brand<"SpotId">();

export type SpotId = z.infer<typeof SpotId>;

export type Spot = {
  id: SpotId;
  userId: UserId;
  name: string;
  latitude: number;
  longitude: number;
  createdAt: Date;
  updatedAt: Date;
};

export function createSpot(params: Spot): Spot {
  return params;
}
