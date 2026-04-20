import { Button } from "@/components/ui/button";

import { SpinnerIcon } from "./spinner-icon";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Icons/SpinnerIcon",
  component: SpinnerIcon,
} satisfies Meta<typeof SpinnerIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: {
    size: 12,
  },
};

export const Large: Story = {
  args: {
    size: 32,
  },
};

export const WithLabel: Story = {
  args: {
    label: "Loading",
  },
};

export const InheritsColor: Story = {
  render: (args) => (
    <div style={{ color: "var(--destructive)" }}>
      <SpinnerIcon {...args} />
    </div>
  ),
};

export const InsideButton: Story = {
  render: (args) => (
    <Button type="button" disabled>
      <SpinnerIcon {...args} />
      Submit
    </Button>
  ),
};
