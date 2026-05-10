import { fetchClient, toResult } from "@/libs/hono";

import type { CreateSpotRequest } from "@/features/spot/types/api";

export async function createSpot(request: CreateSpotRequest): Promise<void> {
  const result = await toResult(fetchClient.spots.$post(request));

  if (result.isErr) {
    throw new Error("Failed to create spot");
  }
}
