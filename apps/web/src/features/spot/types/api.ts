import type { fetchClient } from "@/lib/hono/client";
import type { InferRequestType, InferResponseType } from "hono";

export type CreateSpotRequest = InferRequestType<(typeof fetchClient)["spots"]["$post"]>;

export type GetSpotRequest = InferRequestType<(typeof fetchClient)["spots"][":spotId"]["$get"]>;

export type GetSpotResponseData = Extract<
  InferResponseType<(typeof fetchClient)["spots"][":spotId"]["$get"]>,
  { spot: unknown }
>;

export type UpdateSpotRequest = InferRequestType<
  (typeof fetchClient)["spots"][":spotId"]["$patch"]
>;

export type ListSpotsResponseData = Extract<
  InferResponseType<(typeof fetchClient)["spots"]["$get"]>,
  { spots: unknown[] }
>;

export type ListSpotsItem = ListSpotsResponseData["spots"][number];

export type Spot = ListSpotsItem;

export type SpotId = Spot["id"];

export type Coordinate = Spot["coordinate"];
