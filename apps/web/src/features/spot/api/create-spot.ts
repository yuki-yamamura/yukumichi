import { fetchClient } from "@/lib/hono/client";
import { toResult } from "@/lib/hono/converter";

import type { CreateSpotRequest } from "@/features/spot/types/api";
import type { Result } from "@/utils/result";
import type { ApiError } from "@sanpo/shared/error";

export function createSpot(request: CreateSpotRequest): Promise<Result<null, ApiError>> {
  return toResult(fetchClient.spots.$post(request));
}
