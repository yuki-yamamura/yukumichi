import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

import preview from "#.storybook/preview";

import { Input } from ".";

const meta = preview.meta({
  title: "UI/Input",
  component: Input,
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
    placeholder: "Enter text",
  },
});

export const WithValue = meta.story({
  args: {
    defaultValue: "The quick brown fox",
  },
});

export const Disabled = meta.story({
  args: {
    placeholder: "Enter text",
    disabled: true,
  },
});

export const Invalid = meta.story({
  args: {
    placeholder: "Enter text",
    "aria-invalid": true,
  },
});

export const Email = meta.story({
  args: {
    type: "email",
    placeholder: "you@example.com",
  },
});

export const Password = meta.story({
  args: {
    type: "password",
    defaultValue: "supersecret",
  },
});

export const Number = meta.story({
  args: {
    type: "number",
    placeholder: "0",
  },
});

export const Search = meta.story({
  args: {
    type: "search",
    placeholder: "Search...",
  },
});

export const File = meta.story({
  args: {
    type: "file",
  },
});

export const WithField = meta.story({
  render: () => (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="name">Name</FieldLabel>
        <Input id="name" placeholder="Enter your name" />
      </Field>
    </FieldGroup>
  ),
});

export const WithFieldDescription = meta.story({
  render: () => (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input id="email" type="email" placeholder="you@example.com" />
        <FieldDescription>We will never share your email with anyone.</FieldDescription>
      </Field>
    </FieldGroup>
  ),
});

export const WithFieldError = meta.story({
  render: () => (
    <FieldGroup>
      <Field data-invalid>
        <FieldLabel htmlFor="username">Username</FieldLabel>
        <Input id="username" aria-invalid />
        <FieldError errors={[{ message: "Username is required." }]} />
      </Field>
    </FieldGroup>
  ),
});
