import { serve } from "@hono/node-server";

import app from "@/app";
import { helloRoute } from "./presentation/routes/hello";

app.route("/hello", helloRoute);

serve({
  ...app,
  port: 3010,
});
