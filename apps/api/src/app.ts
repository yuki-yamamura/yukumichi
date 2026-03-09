import { Hono } from "hono";

import { helloRoute } from "@/presentation/routes/hello";

const app = new Hono();

app.get("/", (c) => {
  return c.json({ message: "Hello, Hono!" });
});

const route = app.route("/", helloRoute);

type AppType = typeof route;

export default app;
export type { AppType };
