import z from "zod";

import { latitudeSchema, longitudeSchema } from "@/domain/spot/models/coordinate";

import { spotIdOutputSchema, spotIdParamSchema } from "./id";

import type { Spot } from "@/domain/spot/models/spot";

const spotSchema = z.object({
  coordinate: z.object({
    latitude: latitudeSchema,
    longitude: longitudeSchema,
  }),
  description: z.string().nullable(),
  id: spotIdOutputSchema,
  name: z.string(),
});

export function toSpotResponse(spot: Spot): z.output<typeof spotSchema> {
  return spotSchema.parse(spot);
}

export const createSpotRequestBodySchema = z.object({
  description: z.string().optional(),
  latitude: latitudeSchema,
  longitude: longitudeSchema,
  name: z.string().min(1),
});

export const listSpotsResponseSchema = z.object({
  spots: z.array(spotSchema),
});

export const getSpotRequestParamsSchema = z.object({
  spotId: spotIdParamSchema,
});

export const getSpotResponseSchema = z.object({
  spot: spotSchema,
});

export const archiveSpotRequestParamsSchema = z.object({
  spotId: spotIdParamSchema,
});
