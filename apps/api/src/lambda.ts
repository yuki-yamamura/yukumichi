import { handle } from "hono/aws-lambda";

import { createApp } from "@/app";
import { env } from "@/env/server";

const app = createApp(env);

export const handler = handle(app);
