import { listSpots } from "@/features/spot/api/list-spots";
import { mustBeSuccess } from "@/utils/must-be-success";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { spots } = mustBeSuccess(await listSpots());

  return (
    <main>
      <h1>Sanpo v0.2.0</h1>
      <ul>
        {spots.map((spot) => (
          <li key={spot.id}>{spot.name}</li>
        ))}
      </ul>
    </main>
  );
}
