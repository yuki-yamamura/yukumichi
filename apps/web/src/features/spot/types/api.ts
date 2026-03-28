import { InferResponseType } from "hono";
import { fetchClient } from "@/libs/hono";

export type Spot = InferResponseType<(typeof fetchClient.spots)[":spotId"]["$get"], 200>["spot"];

export type Coordinate = Spot["coordinate"];
