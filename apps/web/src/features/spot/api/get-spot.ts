import { fetchClient } from "@/lib/hono/client";
import { toResult } from "@/lib/hono/converter";

import type { GetSpotRequest, GetSpotResponseData } from "@/features/spot/types/api";
import type { Result } from "@/utils/result";
import type { ApiError } from "@yukumichi/shared/error";

export function getSpot(request: GetSpotRequest): Promise<Result<GetSpotResponseData, ApiError>> {
  return toResult(fetchClient.spots[":spotId"].$get(request));
}
