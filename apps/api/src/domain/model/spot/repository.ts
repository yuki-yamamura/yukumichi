import type { Spot } from "./type";

export interface SpotRepository {
  findByUserId(userId: string): Promise<Spot[]>;
}
