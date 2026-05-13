import { fetchClient } from "@/lib/hono/client";
import { toResult } from "@/lib/hono/converter";

import type { ListSpotsResponseData } from "@/features/spot/types/api";
import type { Result } from "@/utils/result";
import type { ApiError } from "@sanpo/shared/error";

export function listSpots(): Promise<Result<ListSpotsResponseData, ApiError>> {
  return toResult(fetchClient.spots.$get());
}
