import { Input } from "@/components/ui/input";

import preview from "#.storybook/preview";

import { Label } from ".";

const meta = preview.meta({
  title: "UI/Label",
  component: Label,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 400 }}>
        <Story />
      </div>
    ),
  ],
});

export const Default = meta.story({
  args: {
    children: "Email",
  },
});

export const ForInput = meta.story({
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="you@example.com" />
    </div>
  ),
});

export const WithDisabledInput = meta.story({
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <Label htmlFor="username">Username</Label>
      <Input id="username" disabled defaultValue="admin" />
    </div>
  ),
});
