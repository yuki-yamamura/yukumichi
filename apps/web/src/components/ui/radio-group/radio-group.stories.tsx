import { Root, Item } from "./radio-group";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "UI/RadioGroup",
  component: Root,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const DefaultRadioItems = () => (
  <>
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <Item value="default" id="r1" />
      <label htmlFor="r1">Default</label>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <Item value="comfortable" id="r2" />
      <label htmlFor="r2">Comfortable</label>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <Item value="compact" id="r3" />
      <label htmlFor="r3">Compact</label>
    </div>
  </>
);

export const Default: Story = {
  render: () => (
    <Root defaultValue="comfortable">
      <DefaultRadioItems />
    </Root>
  ),
};

export const WithPreselection: Story = {
  render: () => (
    <Root defaultValue="default">
      <DefaultRadioItems />
    </Root>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Root defaultValue="comfortable" disabled>
      <DefaultRadioItems />
    </Root>
  ),
};

export const SingleDisabledItem: Story = {
  render: () => (
    <Root defaultValue="comfortable">
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Item value="default" id="r4" />
        <label htmlFor="r4">Default</label>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Item value="comfortable" id="r5" />
        <label htmlFor="r5">Comfortable</label>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Item value="compact" id="r6" disabled />
        <label htmlFor="r6" style={{ opacity: 0.5 }}>
          Compact (disabled)
        </label>
      </div>
    </Root>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <Root
      defaultValue="comfortable"
      style={{ display: "flex", flexDirection: "row", gap: "1rem" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Item value="default" id="r7" />
        <label htmlFor="r7">Default</label>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Item value="comfortable" id="r8" />
        <label htmlFor="r8">Comfortable</label>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Item value="compact" id="r9" />
        <label htmlFor="r9">Compact</label>
      </div>
    </Root>
  ),
};

export const ManyOptions: Story = {
  render: () => (
    <Root defaultValue="option1">
      {Array.from({ length: 6 }, (_, i) => (
        <div
          key={i}
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <Item value={`option${i + 1}`} id={`rm${i}`} />
          <label htmlFor={`rm${i}`}>Option {i + 1}</label>
        </div>
      ))}
    </Root>
  ),
};
