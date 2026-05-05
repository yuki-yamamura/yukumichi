import { formOptions } from "@tanstack/react-form";
import { z } from "zod";

import { createFloatSchema } from "@/libs/zod/schema";

export const spotFormSchema = z.object({
  description: z
    .string()
    .optional()
    .transform((value) => (value === "" ? undefined : value)),
  latitude: createFloatSchema(z.number().min(-90).max(90)),
  longitude: createFloatSchema(z.number().min(-180).max(180)),
  name: z.string().min(1),
});

export function createSpotFormOptions({
  defaultValues = {
    description: "",
    latitude: "",
    longitude: "",
    name: "",
  },
  onSubmit,
}: {
  defaultValues?: SpotFormInput;
  onSubmit?: () => void;
} = {}) {
  return formOptions({
    defaultValues,
    onSubmit,
    validators: {
      onChange: spotFormSchema,
    },
  });
}

export type SpotForm = z.infer<typeof spotFormSchema>;

export type SpotFormInput = z.input<typeof spotFormSchema>;
