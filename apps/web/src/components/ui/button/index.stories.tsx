import { ChevronRightIcon, LoaderCircleIcon, MailIcon } from "lucide-react";

import { Button } from ".";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "UI/Button",
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Variants
export const Default: Story = {
  args: {
    children: "Button",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Delete",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Ghost",
  },
};

export const Link: Story = {
  args: {
    variant: "link",
    children: "Link",
  },
};

// Sizes
export const SizeDefault: Story = {
  args: {
    children: "Default",
  },
};

export const SizeXs: Story = {
  args: {
    size: "xs",
    children: "Extra Small",
  },
};

export const SizeSm: Story = {
  args: {
    size: "sm",
    children: "Small",
  },
};

export const SizeLg: Story = {
  args: {
    size: "lg",
    children: "Large",
  },
};

export const SizeIcon: Story = {
  args: {
    size: "icon",
    children: <ChevronRightIcon />,
  },
};

// States
export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Disabled",
  },
};

// With icons
export const WithIcon: Story = {
  args: {
    children: (
      <>
        <MailIcon />
        Login with Email
      </>
    ),
  },
};

export const IconRight: Story = {
  args: {
    children: (
      <>
        Next
        <ChevronRightIcon />
      </>
    ),
  },
};

export const Loading: Story = {
  args: {
    disabled: true,
    children: (
      <>
        <LoaderCircleIcon className="animate-spin" />
        Please wait
      </>
    ),
  },
};
