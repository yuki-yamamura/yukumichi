import { fetchClient, toResult } from "@/libs/hono";

import type { ListSpotsResponse } from "@/features/spot/types/api";

export async function listSpots(): Promise<ListSpotsResponse> {
  const result = await toResult(fetchClient.spots.$get());

  if (result.isErr) {
    throw new Error("Failed to fetch spots");
  }

  return result.value;
}
