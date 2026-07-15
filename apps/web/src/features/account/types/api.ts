import type { fetchClient } from "@/lib/hono/client";
import type { InferResponseType } from "hono";

export type GetMeResponseData = Extract<
  InferResponseType<(typeof fetchClient)["accounts"]["me"]["$get"]>,
  { account: unknown }
>;
