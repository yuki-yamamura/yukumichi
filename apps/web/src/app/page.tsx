import { hc } from "hono/client";

import type { AppType } from "@sanpo/api";

export default async function Home() {
  const client = hc<AppType>(process.env.API_BASE_URL!);
  const res = await client.hello.$get({ query: { name: "yuki" } });
  const { message } = await res.json();

  return <div>{message}</div>;
}
