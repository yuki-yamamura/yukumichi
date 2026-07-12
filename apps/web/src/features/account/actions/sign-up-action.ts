"use server";

import { createServerValidate, ServerValidateError } from "@tanstack/react-form-nextjs";
import { redirect } from "next/navigation";

import { signUp } from "@/features/account/api/sign-up";
import { createSignUpFormOptions, signUpFormSchema } from "@/features/account/form/sign-up-form";

import type { SignUpFormInput } from "@/features/account/form/sign-up-form";
import type { ServerFormState } from "@tanstack/react-form-nextjs";

const serverValidate = createServerValidate({
  ...createSignUpFormOptions(),
  onServerValidate: signUpFormSchema,
});

export async function signUpAction(
  _previousState: unknown,
  formData: FormData,
): Promise<ServerFormState<SignUpFormInput, undefined> | undefined> {
  try {
    const parsedFormData = await serverValidate(formData);
    const payload = signUpFormSchema.parse(parsedFormData);
    const result = await signUp({
      json: payload,
    });

    if (result.isErr) {
      switch (result.error.code) {
        case "ACCOUNT_ALREADY_REGISTERED_ERROR":
        case "AUTH_GATEWAY_ERROR":
        case "BAD_REQUEST_ERROR":
        case "DATABASE_ERROR":
        case "UNKNOWN_ERROR":
        case "VALIDATION_ERROR": {
          throw new Error(result.error.message);
        }
        default: {
          result.error satisfies never;
        }
      }
    }

    redirect(`/sign-up/confirm?email=${encodeURIComponent(payload.email)}`);
  } catch (error) {
    if (error instanceof ServerValidateError) {
      return error.formState;
    }

    throw error;
  }
}
