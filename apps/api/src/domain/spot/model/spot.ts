import { err, ok } from "neverthrow";
import { z } from "zod";

import { Coordinate } from "./coordinate";

import type { ValidationError } from "@/domain/error";
import type { Result } from "neverthrow";

export const SpotId = z.uuidv7().brand<"SpotId">();

export type SpotId = z.infer<typeof SpotId>;

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
  id: string;
  latitude: number;
  longitude: number;
  name: string;
  description?: string | null;
};

export function Spot({
  description,
  id,
  name,
  latitude,
  longitude,
}: SpotParams): Result<Spot, ValidationError> {
  const spotIdResult = SpotId.safeParse(id);
  if (!spotIdResult.success) {
    return err({
      kind: "validation",
      message: spotIdResult.error.message,
    });
  }

  const coordinateResult = Coordinate({ latitude, longitude });
  if (coordinateResult.isErr()) {
    return err(coordinateResult.error);
  }

  return ok({
    id: spotIdResult.data,
    name,
    description: description ?? null,
    coordinate: coordinateResult.value,
  });
}

export function archiveSpot(spot: Spot): ArchivedSpot {
  return {
    ...spot,
    archivedAt: new Date(),
  };
}
