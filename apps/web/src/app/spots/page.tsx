import { SpotList } from "@/features/spot/components/spot-list";
import { fetchClient, toResult } from "@/libs/hono";

export const dynamic = "force-dynamic";

export default async function SpotsPage() {
  const result = await toResult(fetchClient.spots.$get());

  if (result.isErr) {
    throw new Error(result.error.message);
  }

  return (
    <main>
      <h1>Spots</h1>
      <SpotList />
    </main>
  );
}
