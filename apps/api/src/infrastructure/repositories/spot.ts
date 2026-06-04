import { and, desc, eq, notExists } from "drizzle-orm";
import { err, ok, Result, ResultAsync } from "neverthrow";

import { Spot, SpotId, spotIdSchema } from "@/domain/spot/models/spot";
import { archivedSpots, spots } from "@/infrastructure/database/schema";

import type { SpotRepository } from "@/domain/spot/repository";
import type { Database } from "@/infrastructure/database/client";

export function SpotRepository(db: Database): SpotRepository {
  return {
    archive: (archivedSpot) =>
      ResultAsync.fromPromise(
        db
          .insert(archivedSpots)
          .values({
            archivedAt: archivedSpot.archivedAt,
            spotId: archivedSpot.id,
          })
          .returning({
            spotId: archivedSpots.spotId,
          }),
        (error) =>
          error instanceof Error
            ? { kind: "DATABASE" as const, message: error.message }
            : { kind: "DATABASE" as const, message: String(error) },
      ).andThen((rows) => ok(spotIdSchema.parse(rows[0].spotId))),

    create({ coordinate: { latitude, longitude }, description, id, name }) {
      return ResultAsync.fromPromise(
        db
          .insert(spots)
          .values({
            description,
            id,
            latitude,
            longitude,
            name,
          })
          .returning({ id: spots.id }),
        (error) =>
          error instanceof Error
            ? { kind: "DATABASE" as const, message: error.message }
            : {
                kind: "DATABASE" as const,
                message: String(error),
              },
      ).andThen((rows) => ok(spotIdSchema.parse(rows[0].id)));
    },

    findArchivedSpotById: (id: SpotId) =>
      ResultAsync.fromPromise(
        db
          .select()
          .from(spots)
          .innerJoin(archivedSpots, eq(archivedSpots.spotId, spots.id))
          .where(eq(spots.id, id)),
        (error) =>
          error instanceof Error
            ? { kind: "DATABASE" as const, message: error.message }
            : { kind: "DATABASE" as const, message: String(error) },
      )
        .andThen((rows) =>
          rows.length === 0
            ? err({ kind: "NOT_FOUND" as const, message: `Archived spot not found: ${id}` })
            : ok(rows[0]),
        )
        .andThen(({ archived_spots: archivedSpot, spots: spot }) =>
          SpotId(spot.id)
            .mapErr((error) => ({ kind: "DATA_INTEGRITY" as const, message: error.message }))
            .andThen((id) =>
              Spot({ ...spot, id })
                .mapErr((error) => ({
                  kind: "DATA_INTEGRITY" as const,
                  message: error.message,
                }))
                .map((spot) => ({ ...spot, archivedAt: archivedSpot.archivedAt })),
            ),
        ),

    findById: (id: SpotId) =>
      ResultAsync.fromPromise(
        db
          .select()
          .from(spots)
          .where(
            and(
              eq(spots.id, id),
              notExists(db.select().from(archivedSpots).where(eq(archivedSpots.spotId, spots.id))),
            ),
          ),
        (error) =>
          error instanceof Error
            ? { kind: "DATABASE" as const, message: error.message }
            : { kind: "DATABASE" as const, message: String(error) },
      )
        .andThen((rows) =>
          rows.length === 0
            ? err({ kind: "NOT_FOUND" as const, message: `Spot not found: ${id}` })
            : ok(rows[0]),
        )
        .andThen((row) =>
          SpotId(row.id)
            .mapErr((error) => ({ kind: "DATA_INTEGRITY" as const, message: error.message }))
            .andThen((id) =>
              Spot({ ...row, id }).mapErr((error) => ({
                kind: "DATA_INTEGRITY" as const,
                message: error.message,
              })),
            ),
        ),

    findMany: () =>
      ResultAsync.fromPromise(
        db
          .select()
          .from(spots)
          .where(
            notExists(db.select().from(archivedSpots).where(eq(archivedSpots.spotId, spots.id))),
          )
          .orderBy(desc(spots.createdAt)),
        (error) =>
          error instanceof Error
            ? { kind: "DATABASE" as const, message: error.message }
            : { kind: "DATABASE" as const, message: String(error) },
      ).andThen((rows) =>
        Result.combine(
          rows.map((row) =>
            SpotId(row.id)
              .mapErr((error) => ({ kind: "DATA_INTEGRITY" as const, message: error.message }))
              .andThen((id) =>
                Spot({ ...row, id }).mapErr((error) => ({
                  kind: "DATA_INTEGRITY" as const,
                  message: error.message,
                })),
              ),
          ),
        ),
      ),
    update: (spot) =>
      ResultAsync.fromPromise(
        db
          .update(spots)
          .set({
            description: spot.description,
            latitude: spot.coordinate.latitude,
            longitude: spot.coordinate.longitude,
            name: spot.name,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(spots.id, spot.id),
              notExists(db.select().from(archivedSpots).where(eq(archivedSpots.spotId, spots.id))),
            ),
          )
          .returning(),
        (error) =>
          error instanceof Error
            ? { kind: "DATABASE" as const, message: error.message }
            : { kind: "DATABASE" as const, message: String(error) },
      )
        .andThen((rows) =>
          rows.length === 0
            ? err({ kind: "NOT_FOUND" as const, message: `Spot not found: ${spot.id}` })
            : ok(rows[0]),
        )
        .andThen((row) =>
          SpotId(row.id)
            .mapErr((error) => ({ kind: "DATA_INTEGRITY" as const, message: error.message }))
            .andThen((id) =>
              Spot({ ...row, id }).mapErr((error) => ({
                kind: "DATA_INTEGRITY" as const,
                message: error.message,
              })),
            ),
        ),
  };
}
