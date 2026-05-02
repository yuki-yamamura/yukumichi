import { and, desc, eq, notExists } from "drizzle-orm";
import { err, ok, Result } from "neverthrow";

import { Spot, SpotId } from "@/domain/spot/models/spot";
import { archivedSpots, spots } from "@/infrastructure/database/schema";

import type { SpotRepository } from "@/domain/spot/repository";
import type { Database } from "@/infrastructure/database/client";

export function SpotRepository(db: Database): SpotRepository {
  return {
    archive: async (archivedSpot) => {
      const rows = await db
        .insert(archivedSpots)
        .values({
          archivedAt: archivedSpot.archivedAt,
          spotId: archivedSpot.id as string,
        })
        .returning({
          spotId: archivedSpots.spotId,
        });

      return ok(SpotId.parse(rows[0].spotId));
    },

    async create(input) {
      const {
        coordinate: { latitude, longitude },
        description,
        id,
        name,
      } = input;
      const rows = await db
        .insert(spots)
        .values({
          description,
          id,
          latitude,
          longitude,
          name,
        })
        .returning({ id: spots.id });
      const spotId = SpotId.parse(rows[0].id);

      return ok(spotId);
    },

    findArchivedSpotById: async (id: SpotId) => {
      const rows = await db
        .select()
        .from(spots)
        .innerJoin(archivedSpots, eq(archivedSpots.spotId, spots.id))
        .where(eq(spots.id, id));

      if (rows.length === 0) {
        return err({ kind: "not_found", message: `Archived spot not found: ${id}` });
      }

      const { archived_spots: archived, spots: row } = rows[0];
      const idResult = SpotId.safeParse(row.id);
      if (!idResult.success) {
        return err({ kind: "data_integrity", message: idResult.error.message });
      }

      return Spot({ ...row, id: idResult.data })
        .map((spot) => ({ ...spot, archivedAt: archived.archivedAt }))
        .mapErr((error) => ({ kind: "data_integrity", message: error.message }));
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
        return err({ kind: "not_found", message: `Spot not found: ${id}` });
      }

      const row = rows[0];
      const idResult = SpotId.safeParse(row.id);
      if (!idResult.success) {
        return err({ kind: "data_integrity", message: idResult.error.message });
      }

      return Spot({ ...row, id: idResult.data }).mapErr((error) => ({
        kind: "data_integrity",
        message: error.message,
      }));
    },

    findMany: async () => {
      const rows = await db
        .select()
        .from(spots)
        .where(notExists(db.select().from(archivedSpots).where(eq(archivedSpots.spotId, spots.id))))
        .orderBy(desc(spots.createdAt));

      return Result.combine(
        rows.map((row) => {
          const idResult = SpotId.safeParse(row.id);
          if (!idResult.success) {
            return err({
              kind: "data_integrity",
              message: idResult.error.message,
            } as const);
          }

          return Spot({ ...row, id: idResult.data }).mapErr(
            (error) =>
              ({
                kind: "data_integrity",
                message: error.message,
              }) as const,
          );
        }),
      );
    },
  };
}
