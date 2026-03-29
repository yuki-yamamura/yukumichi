import z from "zod";

const CoordinateSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

const SpotSchema = z.object({
  id: z.string(),
  name: z.string(),
  coordinate: CoordinateSchema,
});

export const ListSpotsResponseSchema = z.object({
  spots: z.array(SpotSchema),
});

export const GetSpotResponseSchema = z.object({
  spot: SpotSchema,
});

export const ErrorResponseSchema = z.object({
  error: z.string(),
});
