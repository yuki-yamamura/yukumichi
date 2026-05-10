import { fetchClient, toResult } from "@/libs/hono";

export const dynamic = "force-dynamic";

export default async function Home() {
  const result = await toResult(fetchClient.spots.$get());

  if (result.isErr) {
    throw new Error(result.error.message);
  }

  return (
    <main>
      <h1>Sanpo v0.2.0</h1>
      <ul>
        {result.value.spots.map((spot) => (
          <li key={spot.id}>{spot.name}</li>
        ))}
      </ul>
    </main>
  );
}
