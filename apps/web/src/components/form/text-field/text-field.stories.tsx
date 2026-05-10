import z from "zod";

import { useAppForm } from "@/libs/tanstack-form";

import preview from "#.storybook/preview";

import { TextField } from "./text-field";

import type { Decorator } from "@storybook/nextjs-vite";

const withNameFieldContext: Decorator = (Story) => {
  const form = useAppForm({
    defaultValues: {
      name: "",
    },
    validators: {
      onChange: z.object({ name: z.string().min(1) }),
    },
  });

  return <form.AppField name="name">{() => <Story />}</form.AppField>;
};

const withPhoneNumberFieldContext: Decorator = (Story) => {
  const form = useAppForm({
    defaultValues: {
      phoneNumber: "",
    },
    validators: {
      onChange: z.object({
        phoneNumber: z.string().min(1),
      }),
    },
  });

  return <form.AppField name="phoneNumber">{() => Story()}</form.AppField>;
};

const meta = preview.meta({
  component: TextField,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 400 }}>
        <Story />
      </div>
    ),
  ],
  title: "Form/TextField",
});

export const Default = meta.story({
  args: {
    label: "Name",
    placeholder: "Enter your name",
  },
  decorators: [withNameFieldContext],
});

export const Required = meta.story({
  args: {
    label: "Name",
    placeholder: "Enter your name",
    required: true,
  },
  decorators: [withNameFieldContext],
});

export const WithInputModel = meta.story({
  args: {
    inputMode: "tel",
    label: "Phone Number",
    placeholder: "Enter your phone number",
  },
  decorators: [withPhoneNumberFieldContext],
});
