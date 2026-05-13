"use server";

import { createServerValidate, ServerValidateError } from "@tanstack/react-form-nextjs";
import { revalidatePath } from "next/cache";

import { updateSpot } from "@/features/spot/api/update-spot";
import { createSpotFormOptions, spotFormSchema } from "@/features/spot/form/spot-form";
import { mustBeSuccess } from "@/utils/must-be-success";

import type { SpotId } from "@/features/spot/types/api";
import type { ServerFormState } from "@tanstack/react-form-nextjs";

export async function updateSpotAction(
  spotId: SpotId,
  _previousState: unknown,
  formData: FormData,
): Promise<ServerFormState<unknown, undefined> | undefined> {
  try {
    const validatedData = await serverValidate(formData);
    const formValues = spotFormSchema.parse(validatedData);

    mustBeSuccess(await updateSpot({ json: formValues, param: { spotId } }));
    revalidatePath("/");
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
