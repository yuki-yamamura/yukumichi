import { fetchClient } from "@/lib/hono/client";
import { toResult } from "@/lib/hono/converter";

import type { UpdateSpotRequest } from "@/features/spot/types/api";

export function updateSpot(request: UpdateSpotRequest) {
  return toResult(fetchClient.spots[":spotId"].$patch(request));
}
