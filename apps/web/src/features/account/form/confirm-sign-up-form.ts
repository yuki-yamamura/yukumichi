import { formOptions } from "@tanstack/react-form";
import { z } from "zod";

export const confirmSignUpFormSchema = z.object({
  code: z
    .string()
    .length(6)
    .regex(/^\d{6}$/),
  email: z.email(),
});

export function createConfirmSignUpFormOptions({
  defaultValues = {
    code: "",
    email: "",
  },
  onSubmit,
}: {
  defaultValues?: ConfirmSignUpFormInput;
  onSubmit?: () => void;
} = {}) {
  return formOptions({
    defaultValues,
    onSubmit,
    validators: {
      onChange: confirmSignUpFormSchema,
    },
  });
}

export type ConfirmSignUpFormInput = z.input<typeof confirmSignUpFormSchema>;
