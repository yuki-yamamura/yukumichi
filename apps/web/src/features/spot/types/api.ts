import type { fetchClient } from "@/libs/hono";
import type { InferResponseType } from "hono";

export type Spot = InferResponseType<
  (typeof fetchClient.spots)[":spotId"]["$get"],
  200
>["spot"];

export type Coordinate = Spot["coordinate"];
