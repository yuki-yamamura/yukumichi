import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RadioGroup, RadioGroupItem } from "./radio-group";

const meta = {
  title: "UI/RadioGroup",
  component: RadioGroup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const DefaultRadioItems = () => (
  <>
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <RadioGroupItem value="default" id="r1" />
      <label htmlFor="r1">Default</label>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <RadioGroupItem value="comfortable" id="r2" />
      <label htmlFor="r2">Comfortable</label>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <RadioGroupItem value="compact" id="r3" />
      <label htmlFor="r3">Compact</label>
    </div>
  </>
);

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="comfortable">
      <DefaultRadioItems />
    </RadioGroup>
  ),
};

export const WithPreselection: Story = {
  render: () => (
    <RadioGroup defaultValue="default">
      <DefaultRadioItems />
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="comfortable" disabled>
      <DefaultRadioItems />
    </RadioGroup>
  ),
};

export const SingleDisabledItem: Story = {
  render: () => (
    <RadioGroup defaultValue="comfortable">
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <RadioGroupItem value="default" id="r4" />
        <label htmlFor="r4">Default</label>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <RadioGroupItem value="comfortable" id="r5" />
        <label htmlFor="r5">Comfortable</label>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <RadioGroupItem value="compact" id="r6" disabled />
        <label htmlFor="r6" style={{ opacity: 0.5 }}>
          Compact (disabled)
        </label>
      </div>
    </RadioGroup>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <RadioGroup
      defaultValue="comfortable"
      style={{ display: "flex", flexDirection: "row", gap: "1rem" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <RadioGroupItem value="default" id="r7" />
        <label htmlFor="r7">Default</label>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <RadioGroupItem value="comfortable" id="r8" />
        <label htmlFor="r8">Comfortable</label>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <RadioGroupItem value="compact" id="r9" />
        <label htmlFor="r9">Compact</label>
      </div>
    </RadioGroup>
  ),
};

export const ManyOptions: Story = {
  render: () => (
    <RadioGroup defaultValue="option1">
      {Array.from({ length: 6 }, (_, i) => (
        <div
          key={i}
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <RadioGroupItem value={`option${i + 1}`} id={`rm${i}`} />
          <label htmlFor={`rm${i}`}>Option {i + 1}</label>
        </div>
      ))}
    </RadioGroup>
  ),
};
