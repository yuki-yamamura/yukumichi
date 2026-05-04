import { fetchClient } from "@/libs/hono";

import type { CreateSpotRequest } from "@/features/spot/types/api";

export async function createSpot(request: CreateSpotRequest): Promise<void> {
  const res = await fetchClient.spots.$post(request);

  if (!res.ok) {
    throw new Error("Failed to create spot");
  }
}
