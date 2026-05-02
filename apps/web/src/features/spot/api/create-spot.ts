import { fetchClient } from "@/libs/hono";

import type { CreateSpotRequestBody } from "@/features/spot/types/api";

export async function createSpot(params: CreateSpotRequestBody): Promise<void> {
  const res = await fetchClient.spots.$post({ json: params });

  if (!res.ok) {
    throw new Error("Failed to create spot");
  }
}
