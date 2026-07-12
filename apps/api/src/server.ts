import { serve } from "@hono/node-server";

import { createApp } from "@/app";
import { env } from "@/env/server";

const app = createApp(env);

serve({
  fetch: app.fetch,
  port: 3010,
});
