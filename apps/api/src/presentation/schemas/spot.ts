import z from "zod";

import { latitudeSchema, longitudeSchema } from "@/domain/spot/models/coordinate";
import { SpotId } from "@/domain/spot/models/spot";
import { base62Encode } from "@/presentation/helpers/id";

import { publicIdSchema } from "./id";

const spotSchema = z.object({
  coordinate: z.object({
    latitude: latitudeSchema,
    longitude: longitudeSchema,
  }),
  description: z.string().min(1).nullable(),
  id: SpotId.transform(base62Encode),
  name: z.string().min(1),
});

const spotIdParamSchema = publicIdSchema.pipe(SpotId);

export const spotPathParamsSchema = z.object({
  spotId: spotIdParamSchema,
});

export const createSpotRequestBodySchema = z.object({
  description: z.string().min(1).optional(),
  latitude: latitudeSchema,
  longitude: longitudeSchema,
  name: z.string().min(1),
});

export const updateSpotRequestBodySchema = z
  .object({
    description: z.string().min(1),
    latitude: latitudeSchema,
    longitude: longitudeSchema,
    name: z.string().min(1),
  })
  .partial();

export const listSpotsResponseSchema = z.object({
  spots: z.array(spotSchema),
});

export const getSpotResponseSchema = z.object({
  spot: spotSchema,
});
