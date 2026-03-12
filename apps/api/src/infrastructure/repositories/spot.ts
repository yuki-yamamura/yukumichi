import { eq } from "drizzle-orm";
import { db } from "../database/client";
import { spots } from "../database/schema";
import type { SpotRepository } from "@/domain/model/spot/repository";
import type { Spot } from "@/domain/model/spot/type";

export class DrizzleSpotRepository implements SpotRepository {
  async findByUserId(userId: string): Promise<Spot[]> {
    return db.select().from(spots).where(eq(spots.userId, userId));
  }
}
