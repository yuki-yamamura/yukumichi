import { serve } from "@hono/node-server";

import { createApp } from "@/app";

const app = createApp({ databaseUrl: process.env.DATABASE_URL! });

serve({
  ...app,
  port: 3010,
});
