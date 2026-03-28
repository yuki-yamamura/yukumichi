import { fetchClient } from "@/libs/hono";

export const dynamic = "force-dynamic";

export default async function Home() {
  const res = await fetchClient.spots.$get();
  const { spots } = await res.json();

  return (
    <main>
      <h1>Sanpo</h1>
      <ul>
        {spots.map((spot) => (
          <li key={spot.id}>{spot.name}</li>
        ))}
      </ul>
    </main>
  );
}
