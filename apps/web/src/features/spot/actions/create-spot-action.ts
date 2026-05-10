"use server";

import { createServerValidate, ServerValidateError } from "@tanstack/react-form-nextjs";
import { redirect } from "next/navigation";

import { createSpot } from "@/features/spot/api/create-spot";
import { createSpotFormOptions, spotFormSchema } from "@/features/spot/form/spot-form";

export async function createSpotAction(_previousState: unknown, formData: FormData) {
  try {
    const validatedData = await serverValidate(formData);
    const formValues = spotFormSchema.parse(validatedData);

    await createSpot({ json: formValues });
    redirect("/spots");
  } catch (error) {
    if (error instanceof ServerValidateError) {
      return error.formState;
    }

    throw error;
  }
}

const serverValidate = createServerValidate({
  ...createSpotFormOptions(),
  onServerValidate: spotFormSchema,
});
