import { fetchClient } from "@/lib/hono/client";
import { toResult } from "@/lib/hono/converter";

import type { ConfirmSignUpRequest } from "@/features/account/types/api";

export async function confirmSignUp(request: ConfirmSignUpRequest) {
  return toResult(fetchClient.accounts["sign-up"].confirm.$post(request));
}
