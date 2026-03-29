import type { fetchClient } from "@/libs/hono";
import type { InferResponseType } from "hono";

export type Spot = Extract<
  InferResponseType<(typeof fetchClient.spots)[":spotId"]["$get"]>,
  { spot: unknown }
>["spot"];

export type Coordinate = Spot["coordinate"];
