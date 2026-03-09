import { hc } from "hono/client";

import type { AppType } from "../../../api/src/app";

export default async function Home() {
  const client = hc<AppType>("http://localhost:3010");
  const res = await client.hello.$get({ query: { name: "yuki" } });
  const { message } = await res.json();

  return <div>{message}</div>;
}
