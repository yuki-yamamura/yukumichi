import { err, ok } from "neverthrow";
import { uuidv7 } from "uuidv7";
import { z } from "zod";

import { Coordinate } from "./coordinate";

import type { ValidationError } from "@/domain/error";
import type { Result } from "neverthrow";

export const spotIdSchema = z.uuidv7().brand<"SpotId">();

export type SpotId = z.infer<typeof spotIdSchema>;

export function SpotId(value: string): Result<SpotId, ValidationError> {
  const result = spotIdSchema.safeParse(value);

  return result.success
    ? ok(result.data)
    : err({ kind: "validation", message: result.error.message });
}

export function generateSpotId(): SpotId {
  return spotIdSchema.parse(uuidv7());
}

export type Spot = Readonly<{
  coordinate: Coordinate;
  description: string | null;
  id: SpotId;
  name: string;
}>;

export function Spot({
  description,
  id,
  latitude,
  longitude,
  name,
}: {
  description: string | null;
  id: SpotId;
  latitude: number;
  longitude: number;
  name: string;
}): Result<Spot, ValidationError> {
  const coordinateResult = Coordinate({ latitude, longitude });
  if (coordinateResult.isErr()) {
    return err(coordinateResult.error);
  }

  return ok({
    coordinate: coordinateResult.value,
    description,
    id,
    name,
  });
}

export type ArchivedSpot = Spot &
  Readonly<{
    archivedAt: Date;
  }>;

export function archiveSpot(spot: Spot): ArchivedSpot {
  return {
    ...spot,
    archivedAt: new Date(),
  };
}
