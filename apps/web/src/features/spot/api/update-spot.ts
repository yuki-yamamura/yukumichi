import { fetchClient, toResult } from "@/libs/hono";

import type { UpdateSpotRequest } from "@/features/spot/types/api";

export async function updateSpot(request: UpdateSpotRequest): Promise<void> {
  const result = await toResult(fetchClient.spots[":spotId"].$patch(request));

  if (result.isErr) {
    throw new Error("Failed to update spot");
  }
}
