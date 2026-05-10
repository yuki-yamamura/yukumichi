import z from "zod";

import { useAppForm } from "@/libs/tanstack-form";

import preview from "#.storybook/preview";

import { TextareaField } from "./textarea-field";

import type { Decorator } from "@storybook/nextjs-vite";

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
        <div style={{ width: 400 }}>
          <Story />
        </div>
      )}
    </form.AppField>
  );
};

const meta = preview.meta({
  component: TextareaField,
  title: "Form/TextareaField",
});

export const Default = meta.story({
  args: {
    label: "Description",
    placeholder: "A brief description about yourself",
  },
  decorators: [withDescriptionFieldContext],
});

export const Required = meta.story({
  args: {
    label: "Description",
    placeholder: "A berief description about yourself",
    required: true,
  },
  decorators: [withDescriptionFieldContext],
});
