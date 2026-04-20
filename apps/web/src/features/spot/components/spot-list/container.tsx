import { fetchClient } from "@/libs/hono";

import { SpotListPresenter } from "./presenter";

export async function SpotListContainer() {
  const res = await fetchClient.spots.$get();
  const data = await res.json();

  if ("code" in data) {
    throw new Error("something went wrong");
  }

  return <SpotListPresenter spots={data.spots} />;
}
