import { handle } from "hono/aws-lambda";

import { routes } from "@/app";

export const handler = handle(routes);
