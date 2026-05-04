import { listSpots } from "@/features/spot/api/list-spots";

import { SpotListPresenter } from "./presenter";

export async function SpotListContainer() {
  const { spots } = await listSpots();

  return <SpotListPresenter spots={spots} />;
}
