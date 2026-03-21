import { archivedSpots, spots } from "../database/schema";
import { Spot, SpotId } from "@/domain/model/spot/spot";
import type { SpotRepository } from "@/domain/model/spot/repository";
import { Database } from "../database/client";
import { err, ok, Result } from "neverthrow";
import { and, eq, notExists } from "drizzle-orm";

export function SpotRepository(db: Database): SpotRepository {
  return {
    async create(input) {
      const {
        id,
        name,
        coordinate: { latitude, longitude },
      } = input;
      const rows = await db
        .insert(spots)
        .values({
          id,
          name,
          latitude,
          longitude,
        })
        .returning({ id: spots.id });
      const spotId = SpotId.parse(rows[0].id);

      return ok(spotId);
    },

    findMany: async () => {
      const rows = await db
        .select()
        .from(spots)
        .where(notExists(db.select().from(archivedSpots).where(eq(archivedSpots.spotId, spots.id))));
      const spotsResult = Result.combine(rows.map(Spot));
      if (spotsResult.isErr()) {
        throw new Error(spotsResult.error.message);
      }

      return ok(spotsResult.value);
    },

    findById: async (id: SpotId) => {
      const rows = await db
        .select()
        .from(spots)
        .where(
          and(eq(spots.id, id), notExists(db.select().from(archivedSpots).where(eq(archivedSpots.spotId, spots.id)))),
        );

      if (rows.length === 0) {
        return err({ kind: "not_found" });
      }

      const spotResult = Spot(rows[0]);
      if (spotResult.isErr()) {
        throw new Error(spotResult.error.message);
      }

      return ok(spotResult.value);
    },

    archive: async (archivedSpot) => {
      const rows = await db
        .insert(archivedSpots)
        .values({
          spotId: archivedSpot.id as string,
          archivedAt: archivedSpot.archivedAt,
        })
        .returning({
          spotId: archivedSpots.spotId,
        });

      return ok(SpotId.parse(rows[0].spotId));
    },
  };
}
