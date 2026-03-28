import { createSpot } from "@/test/helpers/spot";

import { SpotNameHintPresenter } from "./presenter";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof SpotNameHintPresenter> = {
  title: "SpotNameHintPresenter",
  component: SpotNameHintPresenter,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    spot: createSpot({
      name: "東京タワー",
    }),
  },
};

export default meta;
