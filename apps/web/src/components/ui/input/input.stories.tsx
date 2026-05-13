import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

import preview from "#.storybook/preview";

import { Input } from "./input";

const meta = preview.meta({
  component: Input,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 400 }}>
        <Story />
      </div>
    ),
  ],
  title: "UI/Input",
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
    disabled: true,
    placeholder: "Enter text",
  },
});

export const Invalid = meta.story({
  args: {
    "aria-invalid": true,
    placeholder: "Enter text",
  },
});

export const Email = meta.story({
  args: {
    placeholder: "you@example.com",
    type: "email",
  },
});

export const Password = meta.story({
  args: {
    defaultValue: "supersecret",
    type: "password",
  },
});

export const Number = meta.story({
  args: {
    placeholder: "0",
    type: "number",
  },
});

export const Search = meta.story({
  args: {
    placeholder: "Search...",
    type: "search",
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
        <Input aria-invalid id="username" />
        <FieldError errors={[{ message: "Username is required." }]} />
      </Field>
    </FieldGroup>
  ),
});
