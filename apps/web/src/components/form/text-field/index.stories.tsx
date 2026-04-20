import z from "zod";

import { useAppForm } from "@/libs/tanstack-form";

import { TextField } from ".";

import type { Decorator, Meta, StoryObj } from "@storybook/nextjs-vite";

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

const meta = {
  title: "Form/TextField",
  component: TextField,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Name",
    placeholder: "Enter your name",
  },
  decorators: [withNameFieldContext],
};

export const Required: Story = {
  args: {
    label: "Name",
    placeholder: "Enter your name",
    required: true,
  },
  decorators: [withNameFieldContext],
};

export const WithInputModel: Story = {
  args: {
    label: "Phone Number",
    placeholder: "Enter your phone number",
    inputMode: "tel",
  },
  decorators: [withPhoneNumberFieldContext],
};
