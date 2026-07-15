import { fetchAuthSession } from "aws-amplify/auth";
import { hc } from "hono/client";

import { clientEnv } from "@/env/client";

import type { AppType } from "@yukumichi/api";

export const fetchClient = hc<AppType>(clientEnv.NEXT_PUBLIC_API_BASE_URL, {
  headers: async () => {
    const headers: Record<string, string> = {};
    try {
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();
      if (idToken) headers.Authorization = `Bearer ${idToken}`;
    } catch {
      // no session available; hit the API without auth
    }

    return headers;
  },
});
