import { fetchClient } from "@/lib/hono/client";
import { toResult } from "@/lib/hono/converter";

import type { GetSpotRequest } from "@/features/spot/types/api";

export function getSpot(request: GetSpotRequest) {
  return toResult(fetchClient.spots[":spotId"].$get(request));
}
