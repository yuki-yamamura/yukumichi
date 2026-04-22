import { ChevronRightIcon, LoaderCircleIcon, MailIcon } from "lucide-react";

import preview from "#.storybook/preview";

import { Button } from ".";

const meta = preview.meta({
  component: Button,
  title: "UI/Button",
});

export const Default = meta.story({
  args: {
    children: "Button",
  },
});

export const Destructive = meta.story({
  args: {
    children: "Delete",
    variant: "destructive",
  },
});

export const Outline = meta.story({
  args: {
    children: "Outline",
    variant: "outline",
  },
});

export const Secondary = meta.story({
  args: {
    children: "Secondary",
    variant: "secondary",
  },
});

export const Ghost = meta.story({
  args: {
    children: "Ghost",
    variant: "ghost",
  },
});

export const Link = meta.story({
  args: {
    children: "Link",
    variant: "link",
  },
});

export const SizeDefault = meta.story({
  args: {
    children: "Default",
  },
});

export const SizeXs = meta.story({
  args: {
    children: "Extra Small",
    size: "xs",
  },
});

export const SizeSm = meta.story({
  args: {
    children: "Small",
    size: "sm",
  },
});

export const SizeLg = meta.story({
  args: {
    children: "Large",
    size: "lg",
  },
});

export const SizeIcon = meta.story({
  args: {
    children: <ChevronRightIcon />,
    size: "icon",
  },
});

export const Disabled = meta.story({
  args: {
    children: "Disabled",
    disabled: true,
  },
});

export const WithIcon = meta.story({
  args: {
    children: (
      <>
        <MailIcon />
        Login with Email
      </>
    ),
  },
});

export const IconRight = meta.story({
  args: {
    children: (
      <>
        Next
        <ChevronRightIcon />
      </>
    ),
  },
});

export const Loading = meta.story({
  args: {
    children: (
      <>
        <LoaderCircleIcon className="animate-spin" />
        Please wait
      </>
    ),
    disabled: true,
  },
});
