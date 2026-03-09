import { fetchClient } from "../libs/hono";

export const dynamic = "force-dynamic";

export default async function Home() {
  const res = await fetchClient.hello.$get({ query: { name: "yuki" } });
  const { message } = await res.json();

  return (
    <main>
      <h1>Hello World App</h1>
      <p>{message}</p>
    </main>
  );
}
