import z from "zod";

import { useAppForm } from "@/libs/tanstack-form";

import preview from "#.storybook/preview";

import { TextField } from ".";

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
  title: "Form/TextField",
  component: TextField,
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
    label: "Phone Number",
    placeholder: "Enter your phone number",
    inputMode: "tel",
  },
  decorators: [withPhoneNumberFieldContext],
});
