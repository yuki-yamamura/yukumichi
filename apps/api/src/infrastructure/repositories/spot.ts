import { and, eq, gte, lte, like, type SQL } from "drizzle-orm";
import { spots } from "../database/schema";
import { createSpot } from "@/domain/model/spot/model";
import type { DbClient } from "../database/client";
import type { SpotRepository, SpotSearchFilter } from "@/domain/model/spot/repository";
import type { UserId } from "@/domain/model/user/model";

export function createSpotRepository(db: DbClient): SpotRepository {
  return {
    async findByUserId(userId: UserId) {
      const rows = await db.select().from(spots).where(eq(spots.userId, userId));

      return rows.map(createSpot);
    },

    async search(filter: SpotSearchFilter) {
      const rows = await db
        .select()
        .from(spots)
        .where(
          and(
            eq(spots.userId, filter.userId),
            filter.name !== undefined
              ? like(spots.name, `%${filter.name}%`)
              : undefined,
            filter.latitudeRange !== undefined
              ? gte(spots.latitude, filter.latitudeRange.min)
              : undefined,
            filter.latitudeRange !== undefined
              ? lte(spots.latitude, filter.latitudeRange.max)
              : undefined,
            filter.longitudeRange !== undefined
              ? gte(spots.longitude, filter.longitudeRange.min)
              : undefined,
            filter.longitudeRange !== undefined
              ? lte(spots.longitude, filter.longitudeRange.max)
              : undefined,
          ),
        );

      return rows.map(createSpot);
    },

    async create(input) {
      const [row] = await db.insert(spots).values(input).returning();

      return createSpot(row);
    },
  };
}
