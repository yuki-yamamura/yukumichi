import z from "zod";
import { SpotValidationError } from "./error";
import { err, ok, Result } from "neverthrow";

const latitudeSchema = z.number().min(-90).max(90);
const longitudeSchema = z.number().min(-180).max(180);

export type Coordinate = Readonly<{
  latitude: number;
  longitude: number;
}>;

export function Coordinate({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}): Result<Coordinate, SpotValidationError> {
  const latitudeResult = latitudeSchema.safeParse(latitude);
  if (!latitudeResult.success) {
    return err({ kind: "validation", message: latitudeResult.error.message });
  }

  const longitudeResult = longitudeSchema.safeParse(longitude);
  if (!longitudeResult.success) {
    return err({ kind: "validation", message: longitudeResult.error.message });
  }

  return ok({ latitude: latitudeResult.data, longitude: longitudeResult.data });
}
