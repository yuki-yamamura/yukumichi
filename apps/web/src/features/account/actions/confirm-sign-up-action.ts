"use server";

import { createServerValidate, ServerValidateError } from "@tanstack/react-form-nextjs";
import { redirect } from "next/navigation";

import { confirmSignUp } from "@/features/account/api/confirm-sign-up";
import {
  confirmSignUpFormSchema,
  createConfirmSignUpFormOptions,
} from "@/features/account/form/confirm-sign-up-form";

import type { ConfirmSignUpFormInput } from "@/features/account/form/confirm-sign-up-form";
import type { ServerFormState } from "@tanstack/react-form-nextjs";

const serverValidate = createServerValidate({
  ...createConfirmSignUpFormOptions(),
  onServerValidate: confirmSignUpFormSchema,
});

export async function confirmSignUpAction(
  _previousState: unknown,
  formData: FormData,
): Promise<ServerFormState<ConfirmSignUpFormInput, undefined> | undefined> {
  try {
    const parsedFormData = await serverValidate(formData);
    const payload = confirmSignUpFormSchema.parse(parsedFormData);
    const result = await confirmSignUp({
      json: payload,
    });

    if (result.isErr) {
      switch (result.error.code) {
        case "AUTH_GATEWAY_ERROR":
        case "BAD_REQUEST_ERROR":
        case "CODE_INVALID_ERROR":
        case "DATA_INTEGRITY_ERROR":
        case "DATABASE_ERROR":
        case "NOT_FOUND_ERROR":
        case "UNKNOWN_ERROR": {
          throw new Error(result.error.message);
        }
        default: {
          result.error satisfies never;
        }
      }
    }

    redirect("/");
  } catch (error) {
    if (error instanceof ServerValidateError) {
      return error.formState;
    }

    throw error;
  }
}
