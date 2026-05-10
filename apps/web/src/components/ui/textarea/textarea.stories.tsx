import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

import preview from "#.storybook/preview";

import { Textarea } from "./textarea";

const meta = preview.meta({
  component: Textarea,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 400 }}>
        <Story />
      </div>
    ),
  ],
  title: "UI/Textarea",
});

export const Default = meta.story({
  args: {
    placeholder: "Type your message here.",
  },
});

export const WithValue = meta.story({
  args: {
    defaultValue: "The quick brown fox jumps over the lazy dog.",
  },
});

export const Disabled = meta.story({
  args: {
    disabled: true,
    placeholder: "Type your message here.",
  },
});

export const Invalid = meta.story({
  args: {
    "aria-invalid": true,
    placeholder: "Type your message here.",
  },
});

export const WithField = meta.story({
  render: () => (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="message">Message</FieldLabel>
        <Textarea id="message" placeholder="Type your message here." />
      </Field>
    </FieldGroup>
  ),
});

export const WithFieldDescription = meta.story({
  render: () => (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="bio">Bio</FieldLabel>
        <Textarea id="bio" placeholder="Tell us about yourself." />
        <FieldDescription>You can @mention other users and organizations.</FieldDescription>
      </Field>
    </FieldGroup>
  ),
});

export const WithFieldError = meta.story({
  render: () => (
    <FieldGroup>
      <Field data-invalid>
        <FieldLabel htmlFor="feedback">Feedback</FieldLabel>
        <Textarea aria-invalid id="feedback" />
        <FieldError errors={[{ message: "Feedback is required." }]} />
      </Field>
    </FieldGroup>
  ),
});
