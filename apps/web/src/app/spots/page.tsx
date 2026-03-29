import { CreateSpotForm } from "@/features/spot/components/create-spot-form";
import { fetchClient } from "@/libs/hono";

export const dynamic = "force-dynamic";

export default async function SpotsPage() {
  const res = await fetchClient.spots.$get();
  const { spots } = await res.json();

  return (
    <main>
      <h1>Spots</h1>
      <CreateSpotForm />
      <ul>
        {spots.map((spot) => (
          <li key={spot.id}>{spot.name}</li>
        ))}
      </ul>
    </main>
  );
}
