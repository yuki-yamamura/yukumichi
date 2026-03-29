import z from "zod";

const spotSchema = z.object({
  id: z.uuidv7(),
  name: z.string(),
  coordinate: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
});

export const createSpotRequestBodySchema = z.object({
  name: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
});

export const listSpotsResponseSchema = z.object({
  spots: z.array(spotSchema),
});

export const getSpotRequestParamsSchema = z.object({
  spotId: z.uuidv7(),
});

export const getSpotResponseSchema = z.object({
  spot: spotSchema,
});

export const archiveSpotRequestParamsSchema = z.object({
  spotId: z.uuidv7(),
});
