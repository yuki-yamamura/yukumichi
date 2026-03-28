import { err, ok, Result } from "neverthrow";
import { z } from "zod";

import { SpotValidationError } from "./error";
import { Coordinate } from "./coordinate";

export const SpotId = z.uuidv7().brand<"SpotId">();

export type SpotId = z.infer<typeof SpotId>;

export type Spot = Readonly<{
  id: SpotId;
  name: string;
  coordinate: Coordinate;
}>;

export type ArchivedSpot = Spot &
  Readonly<{
    archivedAt: Date;
  }>;

type SpotParams = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

export function Spot({
  id,
  name,
  latitude,
  longitude,
}: SpotParams): Result<Spot, SpotValidationError> {
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
    coordinate: coordinateResult.value,
  });
}

export function archiveSpot(spot: Spot): ArchivedSpot {
  return {
    ...spot,
    archivedAt: new Date(),
  };
}
