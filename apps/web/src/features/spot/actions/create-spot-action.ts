"use server";

import { createServerValidate, ServerValidateError } from "@tanstack/react-form-nextjs";

import { createSpot } from "@/features/spot/api/create-spot";
import { createSpotFormOptions, spotFormSchema } from "@/features/spot/form/spot-form";

import type { SpotFormInput } from "@/features/spot/form/spot-form";
import type { ServerFormState } from "@tanstack/react-form-nextjs";

const serverValidate = createServerValidate({
  ...createSpotFormOptions(),
  onServerValidate: spotFormSchema,
});

export async function createSpotAction(
  _previousState: unknown,
  formData: FormData,
): Promise<ServerFormState<SpotFormInput, undefined> | undefined> {
  try {
    const parsedFormData = await serverValidate(formData);
    const payload = spotFormSchema.parse(parsedFormData);
    const result = await createSpot({
      json: payload,
    });

    if (result.isErr) {
      switch (result.error.code) {
        case "VALIDATION_ERROR":
        case "BAD_REQUEST_ERROR":
        case "DATABASE_ERROR":
        case "UNKNOWN_ERROR": {
          throw new Error(result.error.message);
        }
        default: {
          result.error satisfies never;
        }
      }
    }
  } catch (error) {
    if (error instanceof ServerValidateError) {
      return error.formState;
    }

    throw error;
  }
}
