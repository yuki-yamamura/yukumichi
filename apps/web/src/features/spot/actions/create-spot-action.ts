"use server";

import { createServerValidate, ServerValidateError } from "@tanstack/react-form-nextjs";
import { redirect } from "next/navigation";

import { createSpot } from "@/features/spot/api/create-spot";
import { createSpotFormOptions, spotFormSchema } from "@/features/spot/form/spot-form";
import { mustBeSuccess } from "@/utils/must-be-success";

export async function createSpotAction(_previousState: unknown, formData: FormData) {
  try {
    const validatedData = await serverValidate(formData);
    const formValues = spotFormSchema.parse(validatedData);

    mustBeSuccess(await createSpot({ json: formValues }));
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
