import { fetchClient } from "@/libs/hono";

export const dynamic = "force-dynamic";

export default async function Home() {
  const response = await fetchClient.spots.$get();
  const data = await response.json();

  if ("code" in data) {
    throw new Error(data.message);
  }

  return (
    <main>
      <h1>Sanpo v0.2.0</h1>
      <ul>
        {data.spots.map((spot) => (
          <li key={spot.id}>{spot.name}</li>
        ))}
      </ul>
    </main>
  );
}
