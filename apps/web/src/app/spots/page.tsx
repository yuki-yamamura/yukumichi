import { SpotList } from "@/features/spot/components/spot-list";

export const dynamic = "force-dynamic";

export default function SpotsPage() {
  return (
    <main>
      <h1>Spots</h1>
      <SpotList />
    </main>
  );
}
