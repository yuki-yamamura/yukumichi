import { handle } from "hono/aws-lambda";

import { createApp } from "@/app";
import { env } from "@/env";

const app = createApp({ databaseUrl: env.DATABASE_URL });

export const handler = handle(app);
