import { eq } from "drizzle-orm";
import { db } from "../database/client";
import { spots } from "../database/schema";
import { createSpot } from "@/domain/model/spot/model";
import type { SpotRepository } from "@/domain/model/spot/repository";
import type { UserId } from "@/domain/model/user/model";

export function createSpotRepository(): SpotRepository {
  return {
    async findByUserId(userId: UserId) {
      const rows = await db
        .select()
        .from(spots)
        .where(eq(spots.userId, userId));

      return rows.map(createSpot);
    },
  };
}
