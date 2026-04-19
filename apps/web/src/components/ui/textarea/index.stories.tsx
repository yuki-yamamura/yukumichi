import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

import { Textarea } from ".";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "UI/Textarea",
  component: Textarea,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Type your message here.",
    style: { width: 400 },
  },
};

export const WithValue: Story = {
  args: {
    defaultValue: "The quick brown fox jumps over the lazy dog.",
    style: { width: 400 },
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Type your message here.",
    disabled: true,
    style: { width: 400 },
  },
};

export const Invalid: Story = {
  args: {
    placeholder: "Type your message here.",
    "aria-invalid": true,
    style: { width: 400 },
  },
};

export const WithField: Story = {
  render: () => (
    <FieldGroup style={{ width: 400 }}>
      <Field>
        <FieldLabel htmlFor="message">Message</FieldLabel>
        <Textarea id="message" placeholder="Type your message here." />
      </Field>
    </FieldGroup>
  ),
};

export const WithFieldDescription: Story = {
  render: () => (
    <FieldGroup style={{ width: 400 }}>
      <Field>
        <FieldLabel htmlFor="bio">Bio</FieldLabel>
        <Textarea id="bio" placeholder="Tell us about yourself." />
        <FieldDescription>You can @mention other users and organizations.</FieldDescription>
      </Field>
    </FieldGroup>
  ),
};

export const WithFieldError: Story = {
  render: () => (
    <FieldGroup style={{ width: 400 }}>
      <Field data-invalid>
        <FieldLabel htmlFor="feedback">Feedback</FieldLabel>
        <Textarea id="feedback" aria-invalid />
        <FieldError errors={[{ message: "Feedback is required." }]} />
      </Field>
    </FieldGroup>
  ),
};
