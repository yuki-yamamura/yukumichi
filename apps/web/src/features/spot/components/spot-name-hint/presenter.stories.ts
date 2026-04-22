import { createSpot } from "@/test/fixtures/spot";

import preview from "#.storybook/preview";

import { SpotNameHintPresenter } from "./presenter";

const meta = preview.meta({
  title: "Features/Spot/SpotNameHintPresenter",
  component: SpotNameHintPresenter,
});

export const Default = meta.story({
  args: {
    spot: createSpot({
      name: "東京タワー",
    }),
  },
});
