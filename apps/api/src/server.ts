import { serve } from "@hono/node-server";

import { createApp } from "@/app";
import { env } from "@/env";

const app = createApp({ databaseUrl: env.DATABASE_URL });

serve({
  ...app,
  port: 3010,
});
