import { Button } from "@/components/ui/button";

import preview from "#.storybook/preview";

import { SpinnerIcon } from "./spinner-icon";

const meta = preview.meta({
  title: "Icons/SpinnerIcon",
  component: SpinnerIcon,
});

export const Default = meta.story();

export const Small = meta.story({
  args: {
    size: 12,
  },
});

export const Large = meta.story({
  args: {
    size: 32,
  },
});

export const WithLabel = meta.story({
  args: {
    label: "Loading",
  },
});

export const InheritsColor = meta.story({
  render: (args) => (
    <div style={{ color: "var(--destructive)" }}>
      <SpinnerIcon {...args} />
    </div>
  ),
});

export const InsideButton = meta.story({
  render: (args) => (
    <Button type="button" disabled>
      <SpinnerIcon {...args} />
      Submit
    </Button>
  ),
});
