import { fetchClient } from "@/lib/hono/client";
import { toResult } from "@/lib/hono/converter";

import type { GetMeResponseData } from "@/features/account/types/api";
import type { Result } from "@/utils/result";
import type { ApiError } from "@yukumichi/shared/error";

export function getMe(): Promise<Result<GetMeResponseData, ApiError>> {
  return toResult(fetchClient.accounts.me.$get());
}
