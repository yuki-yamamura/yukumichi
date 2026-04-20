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

export type CreateSpotRequestBody = InferRequestType<(typeof fetchClient.spots)["$post"]>["json"];
