import { and, desc, eq, notExists } from "drizzle-orm";
import { err, ok, Result } from "neverthrow";

import { Spot, SpotId } from "@/domain/model/spot/spot";
import { archivedSpots, spots } from "@/infrastructure/database/schema";

import type { SpotRepository } from "@/domain/model/spot/repository";
import type { Database } from "@/infrastructure/database/client";

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
        .where(notExists(db.select().from(archivedSpots).where(eq(archivedSpots.spotId, spots.id))))
        .orderBy(desc(spots.createdAt));
      const spotsResult = Result.combine(rows.map((row) => Spot(row)));
      if (spotsResult.isErr()) {
        throw new Error(spotsResult.error.message);
      }

      return ok(spotsResult.value);
    },

    findArchivedSpotById: async (id: SpotId) => {
      const rows = await db
        .select()
        .from(spots)
        .innerJoin(archivedSpots, eq(archivedSpots.spotId, spots.id))
        .where(eq(spots.id, id));

      if (rows.length === 0) {
        return err({ kind: "not_found", message: `archived spot not found: ${id}` });
      }

      const row = rows[0];
      const spotResult = Spot(row.spots);
      if (spotResult.isErr()) {
        throw new Error(spotResult.error.message);
      }

      return ok({
        ...spotResult.value,
        archivedAt: row.archived_spots.archivedAt,
      });
    },

    findById: async (id: SpotId) => {
      const rows = await db
        .select()
        .from(spots)
        .where(
          and(
            eq(spots.id, id),
            notExists(db.select().from(archivedSpots).where(eq(archivedSpots.spotId, spots.id))),
          ),
        );

      if (rows.length === 0) {
        return err({ kind: "not_found", message: `spot not found: ${id}` });
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
