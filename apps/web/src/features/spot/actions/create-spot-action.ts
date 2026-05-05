"use server";

import { createServerValidate, ServerValidateError } from "@tanstack/react-form-nextjs";
import { redirect } from "next/navigation";

import { createSpot } from "@/features/spot/api/create-spot";
import { createSpotFormOptions, spotFormSchema } from "@/features/spot/form/spot-form";

import type { SpotForm } from "@/features/spot/form/spot-form";

export async function createSpotAction(_previousState: unknown, formData: FormData) {
  let values: SpotForm;

  try {
    const validatedData = await serverValidate(formData);
    values = spotFormSchema.parse(validatedData);
  } catch (error) {
    if (error instanceof ServerValidateError) {
      return error.formState;
    }

    throw error;
  }

  await createSpot({ json: values });
  redirect("/spots");
}

const serverValidate = createServerValidate({
  ...createSpotFormOptions(),
  onServerValidate: spotFormSchema,
});
