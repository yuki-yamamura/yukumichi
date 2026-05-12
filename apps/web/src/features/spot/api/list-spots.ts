import { fetchClient } from "@/lib/hono/client";
import { toResult } from "@/lib/hono/converter";

export function listSpots() {
  return toResult(fetchClient.spots.$get());
}
