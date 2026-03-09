import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";

const app = new Hono();

export const helloRoute = app.get(
  "/hello",
  zValidator(
    "query",
    z.object({
      name: z.string().min(1),
    }),
  ),
  (c) => {
    const { name } = c.req.valid("query");
    const message = `Hello, ${name}!`;

    return c.json({ message }, 200);
  },
);
