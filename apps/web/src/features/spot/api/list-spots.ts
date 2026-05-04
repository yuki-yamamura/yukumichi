import { fetchClient } from "@/libs/hono";

import type { ListSpotsResponse } from "@/features/spot/types/api";

export async function listSpots(): Promise<ListSpotsResponse> {
  const result = await fetchClient.spots.$get();
  const data = await result.json();
  if ("code" in data) {
    throw new Error("Failed to fetch spots");
  }

  return data;
}
