import { fetchClient } from "@/libs/hono";

import type { Spot, UpdateSpotRequestBody } from "@/features/spot/types/api";

export async function updateSpot({
  params,
  spotId,
}: {
  params: UpdateSpotRequestBody;
  spotId: Spot["id"];
}): Promise<void> {
  const res = await fetchClient.spots[":spotId"].$patch({
    json: params,
    param: { spotId },
  });
  if (!res.ok) {
    throw new Error("Failed to update spot");
  }
}
