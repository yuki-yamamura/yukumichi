import { createSpot } from "@/test/fixtures/spot";

import preview from "#.storybook/preview";

import { UpdateSpotModal } from "./update-spot-modal";

const meta = preview.meta({
  component: UpdateSpotModal,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "400px" }}>
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
