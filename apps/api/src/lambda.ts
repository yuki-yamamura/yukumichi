import { handle } from "hono/aws-lambda";

import { createApp } from "@/app";

const app = createApp({ databaseUrl: process.env.DATABASE_URL! });

export const handler = handle(app);
