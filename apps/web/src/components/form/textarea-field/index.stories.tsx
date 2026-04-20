import z from "zod";

import { useAppForm } from "@/libs/tanstack-form";

import { TextareaField } from ".";

import type { Decorator, Meta, StoryObj } from "@storybook/nextjs-vite";

const withDescriptionFieldContext: Decorator = (Story) => {
  const form = useAppForm({
    defaultValues: {
      description: "",
    },
    validators: {
      onChange: z.object({ description: z.string().min(1) }),
    },
  });

  return (
    <form.AppField name="description">
      {() => (
        <div style={{ width: "390px" }}>
          <Story />
        </div>
      )}
    </form.AppField>
  );
};

const meta = {
  title: "Form/TextareaField",
  component: TextareaField,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof TextareaField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Description",
    placeholder: "A brief description about yourself",
  },
  decorators: [withDescriptionFieldContext],
};

export const Required: Story = {
  args: {
    label: "Description",
    placeholder: "A berief description about yourself",
    required: true,
  },
  decorators: [withDescriptionFieldContext],
};
