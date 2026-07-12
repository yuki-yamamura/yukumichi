import { fetchClient } from "@/lib/hono/client";
import { toResult } from "@/lib/hono/converter";

import type { SignUpRequest } from "@/features/account/types/api";

export async function signUp(request: SignUpRequest) {
  return toResult(fetchClient.accounts["sign-up"].$post(request));
}
