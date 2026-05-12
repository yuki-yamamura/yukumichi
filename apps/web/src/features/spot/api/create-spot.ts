import { fetchClient } from "@/lib/hono/client";
import { toResult } from "@/lib/hono/converter";

import type { CreateSpotRequest } from "@/features/spot/types/api";

export function createSpot(request: CreateSpotRequest) {
  return toResult(fetchClient.spots.$post(request));
}
