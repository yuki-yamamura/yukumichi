import { fetchClient } from "@/lib/hono/client";
import { toResult } from "@/lib/hono/converter";

import type { UpdateSpotRequest } from "@/features/spot/types/api";
import type { Result } from "@/utils/result";
import type { ApiError } from "@sanpo/shared/error";

export function updateSpot(request: UpdateSpotRequest): Promise<Result<null, ApiError>> {
  return toResult(fetchClient.spots[":spotId"].$patch(request));
}
