import { formOptions } from "@tanstack/react-form";
import { z } from "zod";

const spotFormSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1).optional(),
  latitude: z.number(),
  longitude: z.number(),
});

export type SpotFormValues = z.infer<typeof spotFormSchema>;

export function createSpotFormOptions({
  defaultValues,
  onSubmit,
}: {
  defaultValues?: SpotFormValues;
  onSubmit: ({ value }: { value: SpotFormValues }) => Promise<void>;
}) {
  return formOptions({
    defaultValues,
    validators: {
      onChange: spotFormSchema,
    },
    onSubmit,
  });
}
