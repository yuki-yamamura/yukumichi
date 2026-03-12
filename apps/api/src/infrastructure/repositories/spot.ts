import { eq } from "drizzle-orm";
import { spots } from "../database/schema";
import { createSpot } from "@/domain/model/spot/model";
import type { Database } from "../database/client";
import type { SpotRepository } from "@/domain/model/spot/repository";
import type { UserId } from "@/domain/model/user/model";

export function createSpotRepository(db: Database): SpotRepository {
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
