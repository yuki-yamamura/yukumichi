"use server";

import { revalidatePath } from "next/cache";

import { updateSpot } from "@/features/spot/api/update-spot";

export async function updateSpotAction({
  params,
  spotId,
}: Parameters<typeof updateSpot>[0]): Promise<void> {
  await updateSpot({ params, spotId });
  revalidatePath("/");
}
