import { hc } from "hono/client";

import type { AppType } from "@sanpo/api";

export const fetchClient = hc<AppType>(process.env.API_BASE_URL!);
