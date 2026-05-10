import { serve } from "@hono/node-server";

import { createApp } from "@/app";
import { env } from "@/env";

const app = createApp(env);

serve({
  ...app,
  port: 3010,
});
