import { hc } from "hono/client";

import { clientEnv } from "@/env/client";

import type { AppType } from "@sanpo/api";

export const fetchClient = hc<AppType>(clientEnv.NEXT_PUBLIC_API_BASE_URL);
