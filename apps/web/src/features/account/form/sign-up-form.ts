import { formOptions } from "@tanstack/react-form";
import { z } from "zod";

export const signUpFormSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export function createSignUpFormOptions({
  defaultValues = {
    email: "",
    password: "",
  },
  onSubmit,
}: {
  defaultValues?: SignUpFormInput;
  onSubmit?: () => void;
} = {}) {
  return formOptions({
    defaultValues,
    onSubmit,
    validators: {
      onChange: signUpFormSchema,
    },
  });
}

export type SignUpFormInput = z.input<typeof signUpFormSchema>;
