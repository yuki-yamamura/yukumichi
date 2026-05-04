import { createSpot } from "@/test/fixtures/spot";

import preview from "#.storybook/preview";

import { UpdateSpotModal } from ".";

const meta = preview.meta({
  component: UpdateSpotModal,
  decorators: [
    (Story) => (
      <div style={{ width: "390px" }}>
        <Story />
      </div>
    ),
  ],
  title: "Features/Spot/UpdateSpotModal",
});

export const Default = meta.story({
  args: {
    spot: createSpot(),
  },
});
