import z from "zod";

import { spotIdOutputSchema, spotIdParamSchema } from "./id";

import type { Spot } from "@/domain/spot/models/spot";

const spotSchema = z.object({
  id: spotIdOutputSchema,
  name: z.string(),
  description: z.string().nullable(),
  coordinate: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
});

export function toSpotResponse(spot: Spot): z.output<typeof spotSchema> {
  return spotSchema.parse(spot);
}

export const createSpotRequestBodySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
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
