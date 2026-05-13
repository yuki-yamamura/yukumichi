import { listSpots } from "@/features/spot/api/list-spots";
import { mustBeSuccess } from "@/utils/must-be-success";

import { SpotListPresenter } from "./presenter";

export async function SpotListContainer() {
  const { spots } = mustBeSuccess(await listSpots());

  return <SpotListPresenter spots={spots} />;
}
