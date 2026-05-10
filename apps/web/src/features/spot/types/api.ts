import type { fetchClient } from "@/lib/hono";
import type { InferRequestType, InferResponseType } from "hono";

type Client = typeof fetchClient;

export type Spot = Extract<
  InferResponseType<Client["spots"][":spotId"]["$get"]>,
  { spot: unknown }
>["spot"];

export type SpotId = Spot["id"];

export type Coordinate = Spot["coordinate"];

export type CreateSpotRequest = InferRequestType<Client["spots"]["$post"]>;

export type UpdateSpotRequest = InferRequestType<Client["spots"][":spotId"]["$patch"]>;

export type ListSpotsResponse = Extract<
  InferResponseType<Client["spots"]["$get"]>,
  { spots: unknown[] }
>;

export type ListSpotsItem = ListSpotsResponse["spots"][number];
