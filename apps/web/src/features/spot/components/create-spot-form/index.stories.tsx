import { CreateSpotForm } from ".";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof CreateSpotForm> = {
  title: "Features/Spot/CreateSpotForm",
  component: CreateSpotForm,
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/spots/new",
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "390px" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CreateSpotForm>;

export const Default: Story = {};
