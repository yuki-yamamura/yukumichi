import { Input } from "@/components/ui/input";

import preview from "#.storybook/preview";

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

const meta = preview.meta({
  component: Field,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 400 }}>
        <Story />
      </div>
    ),
  ],
  title: "UI/Field",
});

export const Vertical = meta.story({
  render: () => (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="name">Name</FieldLabel>
        <Input id="name" placeholder="Enter your name" />
      </Field>
    </FieldGroup>
  ),
});

export const Horizontal = meta.story({
  render: () => (
    <FieldGroup>
      <Field orientation="horizontal">
        <FieldLabel htmlFor="name-h">Name</FieldLabel>
        <Input id="name-h" placeholder="Enter your name" />
      </Field>
    </FieldGroup>
  ),
});

export const WithDescription = meta.story({
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

export const WithError = meta.story({
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

export const WithMultipleErrors = meta.story({
  render: () => (
    <FieldGroup>
      <Field data-invalid>
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <Input aria-invalid id="password" type="password" />
        <FieldError
          errors={[
            { message: "Must be at least 8 characters." },
            { message: "Must contain a number." },
          ]}
        />
      </Field>
    </FieldGroup>
  ),
});

export const MultipleFields = meta.story({
  render: () => (
    <FieldGroup>
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
});

export const WithFieldSet = meta.story({
  render: () => (
    <FieldSet>
      <FieldLegend>Personal Information</FieldLegend>
      <FieldGroup>
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
});

export const HorizontalWithContent = meta.story({
  render: () => (
    <FieldGroup>
      <Field orientation="horizontal">
        <FieldContent>
          <FieldTitle>Notifications</FieldTitle>
          <FieldDescription>Receive email notifications about updates.</FieldDescription>
        </FieldContent>
        <Input id="notify" type="checkbox" style={{ height: 16, width: 16 }} />
      </Field>
    </FieldGroup>
  ),
});

export const WithSeparator = meta.story({
  render: () => (
    <FieldGroup>
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
});

export const SeparatorWithText = meta.story({
  render: () => (
    <FieldGroup>
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
});
