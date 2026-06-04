import { err, ok } from "neverthrow";
import z from "zod";

import type { ValidationError } from "@/domain/error";
import type { Result } from "neverthrow";

export const latitudeSchema = z.number().min(-90).max(90);

export const longitudeSchema = z.number().min(-180).max(180);

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
}): Result<Coordinate, ValidationError> {
  const latitudeResult = latitudeSchema.safeParse(latitude);
  if (!latitudeResult.success) {
    return err({ kind: "VALIDATION", message: latitudeResult.error.message });
  }

  const longitudeResult = longitudeSchema.safeParse(longitude);
  if (!longitudeResult.success) {
    return err({ kind: "VALIDATION", message: longitudeResult.error.message });
  }

  return ok({ latitude: latitudeResult.data, longitude: longitudeResult.data });
}
