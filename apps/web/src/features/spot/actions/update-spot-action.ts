"use server";

import { createServerValidate, ServerValidateError } from "@tanstack/react-form-nextjs";
import { revalidatePath } from "next/cache";

import { updateSpot } from "@/features/spot/api/update-spot";
import { createSpotFormOptions, spotFormSchema } from "@/features/spot/form/spot-form";

import type { SpotForm } from "@/features/spot/form/spot-form";
import type { SpotId } from "@/features/spot/types/api";

export async function updateSpotAction(
  spotId: SpotId,
  _previousState: unknown,
  formData: FormData,
) {
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

  await updateSpot({ json: values, param: { spotId } });
  revalidatePath("/");
}

const serverValidate = createServerValidate({
  ...createSpotFormOptions(),
  onServerValidate: spotFormSchema,
});
