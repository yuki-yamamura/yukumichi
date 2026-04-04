"use server";

import { fetchClient } from "@/libs/hono";

export async function createSpot(data: {
  latitude: number;
  longitude: number;
  name: string;
  description?: string;
}) {
  const res = await fetchClient.spots.$post({ json: data });

  if (!res.ok) {
    throw new Error("Failed to create spot");
  }
}
