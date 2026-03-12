import { Hono } from "hono";
import { cors } from "hono/cors";

import { helloRoute } from "./presentation/routes/hello";
import { publicRoutesRoute } from "./presentation/routes/public-routes";
import { spotsRoute } from "./presentation/routes/spots";

const app = new Hono();
app.use(cors());

const route = app
  .get("/", (c) => {
    return c.json({ message: "Hello, Hono!" });
  })
  .route("/", helloRoute)
  .route("/", spotsRoute)
  .route("/", publicRoutesRoute);

type AppType = typeof route;

export default route;
export type { AppType };
