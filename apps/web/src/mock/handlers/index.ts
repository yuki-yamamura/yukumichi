import { spotHandlers } from "./spot";

import type { HttpHandler } from "msw";

export const handlers: HttpHandler[] = [...spotHandlers];
