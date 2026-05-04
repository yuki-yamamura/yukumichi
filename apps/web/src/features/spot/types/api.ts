import type { fetchClient } from "@/libs/hono";
import type { InferRequestType, InferResponseType } from "hono";

export type Spot = Extract<
  InferResponseType<(typeof fetchClient.spots)[":spotId"]["$get"]>,
  { spot: unknown }
>["spot"];

export type SpotItem = Extract<
  InferResponseType<typeof fetchClient.spots.$get>,
  { spots: unknown }
>["spots"][number];

export type Coordinate = Spot["coordinate"];

export type CreateSpotRequest = InferRequestType<(typeof fetchClient.spots)["$post"]>;

export type UpdateSpotRequest = InferRequestType<(typeof fetchClient.spots)[":spotId"]["$patch"]>;

export type ListSpotsResponse = Extract<
  InferResponseType<typeof fetchClient.spots.$get>,
  { spots: unknown }
>;

export type ListSpotsItem = ListSpotsResponse["spots"][number];
