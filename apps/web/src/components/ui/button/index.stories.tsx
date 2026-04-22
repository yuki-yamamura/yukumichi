import { ChevronRightIcon, LoaderCircleIcon, MailIcon } from "lucide-react";

import preview from "#.storybook/preview";

import { Button } from ".";

const meta = preview.meta({
  title: "UI/Button",
  component: Button,
});

export const Default = meta.story({
  args: {
    children: "Button",
  },
});

export const Destructive = meta.story({
  args: {
    variant: "destructive",
    children: "Delete",
  },
});

export const Outline = meta.story({
  args: {
    variant: "outline",
    children: "Outline",
  },
});

export const Secondary = meta.story({
  args: {
    variant: "secondary",
    children: "Secondary",
  },
});

export const Ghost = meta.story({
  args: {
    variant: "ghost",
    children: "Ghost",
  },
});

export const Link = meta.story({
  args: {
    variant: "link",
    children: "Link",
  },
});

export const SizeDefault = meta.story({
  args: {
    children: "Default",
  },
});

export const SizeXs = meta.story({
  args: {
    size: "xs",
    children: "Extra Small",
  },
});

export const SizeSm = meta.story({
  args: {
    size: "sm",
    children: "Small",
  },
});

export const SizeLg = meta.story({
  args: {
    size: "lg",
    children: "Large",
  },
});

export const SizeIcon = meta.story({
  args: {
    size: "icon",
    children: <ChevronRightIcon />,
  },
});

export const Disabled = meta.story({
  args: {
    disabled: true,
    children: "Disabled",
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
    disabled: true,
    children: (
      <>
        <LoaderCircleIcon className="animate-spin" />
        Please wait
      </>
    ),
  },
});
