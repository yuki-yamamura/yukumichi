import { CreateSpotForm } from "@/features/spot/components/create-spot-form";
import { SpotList } from "@/features/spot/components/spot-list";
import { fetchClient } from "@/libs/hono";

export const dynamic = "force-dynamic";

export default async function SpotsPage() {
  const res = await fetchClient.spots.$get();
  const data = await res.json();

  if ("code" in data) {
    throw new Error(data.message);
  }

  return (
    <main>
      <h1>Spots</h1>
      <CreateSpotForm />
      <SpotList />
    </main>
  );
}
