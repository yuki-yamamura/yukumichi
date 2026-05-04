import { fetchClient } from "@/libs/hono";

import type { UpdateSpotRequest } from "@/features/spot/types/api";

export async function updateSpot(request: UpdateSpotRequest): Promise<void> {
  const res = await fetchClient.spots[":spotId"].$patch(request);
  if (!res.ok) {
    throw new Error("Failed to update spot");
  }
}
