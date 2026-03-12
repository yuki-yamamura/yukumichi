import type { UserId } from "@/domain/model/user/model";
import type { Spot } from "./model";

export type SpotRepository = {
  findByUserId: (userId: UserId) => Promise<Spot[]>;
};
