import { Hono } from "hono";
import { cors } from "hono/cors";

import { helloRoute } from "./presentation/routes/hello";

const app = new Hono();
app.use(cors());

const route = app
  .get("/", (c) => {
    return c.json({ message: "Hello, Hono!" });
  })
  .route("/", helloRoute);

type AppType = typeof route;

export default route;
export type { AppType };
