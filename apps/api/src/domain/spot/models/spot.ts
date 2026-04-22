import { err, ok } from "neverthrow";
import { uuidv7 } from "uuidv7";
import { z } from "zod";

import { Coordinate } from "./coordinate";

import type { ValidationError } from "@/domain/error";
import type { Result } from "neverthrow";

export const SpotId = z.uuidv7().brand<"SpotId">();

export type SpotId = z.infer<typeof SpotId>;

export function generateSpotId(): SpotId {
  return SpotId.parse(uuidv7());
}

export type Spot = Readonly<{
  coordinate: Coordinate;
  description: string | null;
  id: SpotId;
  name: string;
}>;

export type ArchivedSpot = Spot &
  Readonly<{
    archivedAt: Date;
  }>;

type SpotParams = {
  id: SpotId;
  latitude: number;
  longitude: number;
  name: string;
  description?: string | null;
};

export function Spot({
  description,
  id,
  latitude,
  longitude,
  name,
}: SpotParams): Result<Spot, ValidationError> {
  const coordinateResult = Coordinate({ latitude, longitude });
  if (coordinateResult.isErr()) {
    return err(coordinateResult.error);
  }

  return ok({
    coordinate: coordinateResult.value,
    description: description ?? null,
    id,
    name,
  });
}

export function archiveSpot(spot: Spot): ArchivedSpot {
  return {
    ...spot,
    archivedAt: new Date(),
  };
}
