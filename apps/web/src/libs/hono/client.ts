import { hc } from "hono/client";

import type { AppType } from "@sanpo/api";

if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export const fetchClient = hc<AppType>(process.env.NEXT_PUBLIC_API_BASE_URL);
