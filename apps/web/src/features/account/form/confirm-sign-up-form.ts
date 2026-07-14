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
}: {
  defaultValues?: ConfirmSignUpFormInput;
} = {}) {
  return formOptions({
    defaultValues,
    validators: {
      onChange: confirmSignUpFormSchema,
    },
  });
}

export type ConfirmSignUpFormInput = z.input<typeof confirmSignUpFormSchema>;
