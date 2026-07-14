import { formOptions } from "@tanstack/react-form";
import { z } from "zod";

export const signInFormSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export function createSignInFormOptions({
  defaultValues = {
    email: "",
    password: "",
  },
}: {
  defaultValues?: SignInFormInput;
} = {}) {
  return formOptions({
    defaultValues,
    validators: {
      onChange: signInFormSchema,
    },
  });
}

export type SignInFormInput = z.input<typeof signInFormSchema>;
