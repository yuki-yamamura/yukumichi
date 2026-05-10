import type { fetchClient } from "@/lib/hono";
import type { InferRequestType, InferResponseType } from "hono";

export type Spot = Extract<
  InferResponseType<(typeof fetchClient)["spots"][":spotId"]["$get"]>,
  { spot: unknown }
>["spot"];

export type SpotId = Spot["id"];

export type Coordinate = Spot["coordinate"];

export type CreateSpotRequest = InferRequestType<(typeof fetchClient)["spots"]["$post"]>;

export type UpdateSpotRequest = InferRequestType<
  (typeof fetchClient)["spots"][":spotId"]["$patch"]
>;

export type UpdateSpotResponse = InferResponseType<
  (typeof fetchClient)["spots"][":spotId"]["$patch"]
>;

export type ListSpotsResponse = Extract<
  InferResponseType<(typeof fetchClient)["spots"]["$get"]>,
  { spots: unknown[] }
>;

export type ListSpotsItem = ListSpotsResponse["spots"][number];
