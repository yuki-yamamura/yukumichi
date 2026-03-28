import { fetchClient } from "@/libs/hono";
import { SpotNameHintPresenter } from "./presenter";

/* This is an example component to test; so its logic does not make sense. */
export async function SpotNameHint() {
  const res = await fetchClient.spots[":spotId"].$get({
    param: {
      spotId: "01961f7e-b5c0-7000-8000-000000000001",
    },
  });
  if (res.status === 404) {
    return null;
  }

  if (res.ok) {
    const { spot } = await res.json();

    return <SpotNameHintPresenter spot={spot} />;
  }
}
