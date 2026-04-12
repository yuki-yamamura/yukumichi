import { Input } from "@/components/ui/input";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from ".";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "UI/Field",
  component: Field,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

// Orientations
export const Vertical: Story = {
  render: () => (
    <FieldGroup style={{ maxWidth: 400 }}>
      <Field>
        <FieldLabel htmlFor="name">Name</FieldLabel>
        <Input id="name" placeholder="Enter your name" />
      </Field>
    </FieldGroup>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <FieldGroup style={{ maxWidth: 400 }}>
      <Field orientation="horizontal">
        <FieldLabel htmlFor="name-h">Name</FieldLabel>
        <Input id="name-h" placeholder="Enter your name" />
      </Field>
    </FieldGroup>
  ),
};

// With Description
export const WithDescription: Story = {
  render: () => (
    <FieldGroup style={{ maxWidth: 400 }}>
      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input id="email" type="email" placeholder="you@example.com" />
        <FieldDescription>We will never share your email with anyone.</FieldDescription>
      </Field>
    </FieldGroup>
  ),
};

// With Error
export const WithError: Story = {
  render: () => (
    <FieldGroup style={{ maxWidth: 400 }}>
      <Field data-invalid>
        <FieldLabel htmlFor="username">Username</FieldLabel>
        <Input id="username" aria-invalid />
        <FieldError errors={[{ message: "Username is required." }]} />
      </Field>
    </FieldGroup>
  ),
};

export const WithMultipleErrors: Story = {
  render: () => (
    <FieldGroup style={{ maxWidth: 400 }}>
      <Field data-invalid>
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <Input id="password" type="password" aria-invalid />
        <FieldError
          errors={[
            { message: "Must be at least 8 characters." },
            { message: "Must contain a number." },
          ]}
        />
      </Field>
    </FieldGroup>
  ),
};

// FieldGroup with multiple fields
export const MultipleFields: Story = {
  render: () => (
    <FieldGroup style={{ maxWidth: 400 }}>
      <Field>
        <FieldLabel htmlFor="first">First Name</FieldLabel>
        <Input id="first" placeholder="John" />
      </Field>
      <Field>
        <FieldLabel htmlFor="last">Last Name</FieldLabel>
        <Input id="last" placeholder="Doe" />
      </Field>
      <Field>
        <FieldLabel htmlFor="bio">Bio</FieldLabel>
        <Input id="bio" placeholder="Tell us about yourself" />
        <FieldDescription>Optional, but we would love to know more.</FieldDescription>
      </Field>
    </FieldGroup>
  ),
};

// FieldSet with Legend
export const WithFieldSet: Story = {
  render: () => (
    <FieldSet>
      <FieldLegend>Personal Information</FieldLegend>
      <FieldGroup style={{ maxWidth: 400 }}>
        <Field>
          <FieldLabel htmlFor="fn">First Name</FieldLabel>
          <Input id="fn" />
        </Field>
        <Field>
          <FieldLabel htmlFor="ln">Last Name</FieldLabel>
          <Input id="ln" />
        </Field>
      </FieldGroup>
    </FieldSet>
  ),
};

// FieldContent (for horizontal layout with description)
export const HorizontalWithContent: Story = {
  render: () => (
    <FieldGroup style={{ maxWidth: 500 }}>
      <Field orientation="horizontal">
        <FieldContent>
          <FieldTitle>Notifications</FieldTitle>
          <FieldDescription>Receive email notifications about updates.</FieldDescription>
        </FieldContent>
        <Input id="notify" type="checkbox" style={{ width: 16, height: 16 }} />
      </Field>
    </FieldGroup>
  ),
};

// FieldSeparator
export const WithSeparator: Story = {
  render: () => (
    <FieldGroup style={{ maxWidth: 400 }}>
      <Field>
        <FieldLabel htmlFor="s-email">Email</FieldLabel>
        <Input id="s-email" type="email" />
      </Field>
      <FieldSeparator />
      <Field>
        <FieldLabel htmlFor="s-pass">Password</FieldLabel>
        <Input id="s-pass" type="password" />
      </Field>
    </FieldGroup>
  ),
};

export const SeparatorWithText: Story = {
  render: () => (
    <FieldGroup style={{ maxWidth: 400 }}>
      <Field>
        <FieldLabel htmlFor="st-email">Email</FieldLabel>
        <Input id="st-email" type="email" />
      </Field>
      <FieldSeparator>or</FieldSeparator>
      <Field>
        <FieldLabel htmlFor="st-phone">Phone</FieldLabel>
        <Input id="st-phone" type="tel" />
      </Field>
    </FieldGroup>
  ),
};
