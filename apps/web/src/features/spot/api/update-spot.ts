import { fetchClient } from "@/lib/hono/client";
import { toResult } from "@/lib/hono/converter";

import type { UpdateSpotRequest } from "@/features/spot/types/api";

export async function updateSpot(request: UpdateSpotRequest): Promise<void> {
  const result = await toResult(fetchClient.spots[":spotId"].$patch(request));

  if (result.isErr) {
    throw new Error("Failed to update spot");
  }
}
