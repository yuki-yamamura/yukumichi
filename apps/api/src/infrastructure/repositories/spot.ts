import { and, desc, eq, notExists } from "drizzle-orm";
import { err, ok, Result } from "neverthrow";

import { Spot, SpotId } from "@/domain/spot/models/spot";
import { archivedSpots, spots } from "@/infrastructure/database/schema";

import type { ValidationError } from "@/domain/error";
import type { SpotRepository } from "@/domain/spot/repository";
import type { Database } from "@/infrastructure/database/client";

function reconstructSpot(row: typeof spots.$inferSelect): Result<Spot, ValidationError> {
  const idResult = SpotId.safeParse(row.id);
  if (!idResult.success) {
    return err({ kind: "validation", message: idResult.error.message });
  }

  return Spot({ ...row, id: idResult.data });
}

export function SpotRepository(db: Database): SpotRepository {
  return {
    async create(input) {
      const {
        id,
        name,
        description,
        coordinate: { latitude, longitude },
      } = input;
      const rows = await db
        .insert(spots)
        .values({
          id,
          name,
          description,
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
      const spotsResult = Result.combine(rows.map((row) => reconstructSpot(row)));
      if (spotsResult.isErr()) {
        return err({
          kind: "data_integrity",
          message: `failed to reconstruct Spot from DB: ${spotsResult.error.message}`,
        });
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
      const spotResult = reconstructSpot(row.spots);
      if (spotResult.isErr()) {
        return err({
          kind: "data_integrity",
          message: `failed to reconstruct Spot from DB: ${spotResult.error.message}`,
        });
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

      const spotResult = reconstructSpot(rows[0]);
      if (spotResult.isErr()) {
        return err({
          kind: "data_integrity",
          message: `failed to reconstruct Spot from DB: ${spotResult.error.message}`,
        });
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
